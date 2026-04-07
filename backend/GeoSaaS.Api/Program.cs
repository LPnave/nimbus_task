using System.Text;
using GeoSaaS.Api.Data;
using GeoSaaS.Api.Middleware;
using GeoSaaS.Api.Models;
using GeoSaaS.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using Serilog;
using Serilog.Events;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
    .Enrich.FromLogContext()
    .WriteTo.Console(new Serilog.Formatting.Compact.CompactJsonFormatter())
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.Host.UseSerilog((ctx, services, config) => config
        .ReadFrom.Configuration(ctx.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext()
        .WriteTo.Console(new Serilog.Formatting.Compact.CompactJsonFormatter()));

    // Database
    var connStr = builder.Configuration.GetConnectionString("Default")
        ?? builder.Configuration["ConnectionStrings__Default"]
        ?? throw new InvalidOperationException("Connection string 'Default' not configured.");

    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(connStr));

    // Identity
    builder.Services.AddIdentity<ApplicationUser, IdentityRole>(opts =>
    {
        opts.Password.RequireDigit = true;
        opts.Password.RequiredLength = 8;
        opts.Password.RequireUppercase = true;
        opts.Password.RequireLowercase = true;
        opts.Password.RequireNonAlphanumeric = false;
        opts.User.RequireUniqueEmail = true;
    })
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

    // BCrypt password hasher override
    builder.Services.AddScoped<IPasswordHasher<ApplicationUser>, BcryptPasswordHasher>();

    // JWT
    var jwtSecret = builder.Configuration["JWT_SECRET"]
        ?? throw new InvalidOperationException("JWT_SECRET not configured.");

    builder.Services.AddAuthentication(opts =>
    {
        opts.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        opts.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(opts =>
    {
        opts.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "geosaas",
            ValidAudience = "geosaas",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ClockSkew = TimeSpan.Zero,
        };
    });

    builder.Services.AddAuthorization();

    // CORS
    var corsOrigins = builder.Configuration.GetSection("Cors:Origins").Get<string[]>()
        ?? ["http://localhost:3000", "http://localhost:5173"];

    builder.Services.AddCors(opts =>
    {
        opts.AddDefaultPolicy(policy =>
            policy.WithOrigins(corsOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials());
    });

    // Redis distributed cache
    var redisConn = builder.Configuration["Redis__ConnectionString"] ?? "redis:6379";
    builder.Services.AddStackExchangeRedisCache(opts =>
    {
        opts.Configuration = redisConn;
        opts.InstanceName = "geosaas:";
    });

    // Response caching
    builder.Services.AddResponseCaching();

    // Services
    builder.Services.AddScoped<IAuthService, AuthService>();
    builder.Services.AddScoped<ILocationService, LocationService>();
    builder.Services.AddScoped<IClusterService, ClusterService>();

    // Controllers
    builder.Services.AddControllers()
        .AddJsonOptions(opts =>
        {
            opts.JsonSerializerOptions.PropertyNamingPolicy =
                System.Text.Json.JsonNamingPolicy.CamelCase;
        });

    // OpenAPI (built-in .NET 10)
    builder.Services.AddOpenApi(opts =>
    {
        opts.AddDocumentTransformer((doc, ctx, ct) =>
        {
            doc.Info.Title = "GeoSaaS API";
            doc.Info.Version = "v1";
            doc.Info.Description = "Geospatial SaaS REST API";
            return Task.CompletedTask;
        });
    });

    var app = builder.Build();

    app.UseSerilogRequestLogging();
    app.UseResponseCaching();

    // DB migration + seed with retry
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var retries = 10;
        while (retries > 0)
        {
            try
            {
                db.Database.Migrate();
                await SeedData.InitializeAsync(scope.ServiceProvider);
                break;
            }
            catch (Exception ex)
            {
                retries--;
                Log.Warning(ex, "DB not ready, retrying in 3s... ({Retries} left)", retries);
                if (retries == 0) throw;
                await Task.Delay(3000);
            }
        }
    }

    app.UseMiddleware<ErrorHandlingMiddleware>();

    if (app.Environment.IsDevelopment())
    {
        app.MapOpenApi();
        app.MapScalarApiReference(opts =>
        {
            opts.Title = "GeoSaaS API";
            opts.AddPreferredSecuritySchemes("Bearer");
        });
    }

    app.UseCors();
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();

    // Health check endpoint
    app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application startup failed.");
}
finally
{
    Log.CloseAndFlush();
}
