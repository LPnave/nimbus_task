using GeoSaaS.Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace GeoSaaS.Api.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Location> Locations => Set<Location>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Location>(entity =>
        {
            entity.HasKey(l => l.Id);
            entity.Property(l => l.Name).HasMaxLength(255).IsRequired();
            entity.Property(l => l.Description).HasColumnType("text");
            entity.Property(l => l.Category).HasMaxLength(100).IsRequired();
            entity.Property(l => l.CreatedAt).HasColumnType("timestamptz");
            entity.Property(l => l.UpdatedAt).HasColumnType("timestamptz");
            entity.HasOne(l => l.Creator)
                  .WithMany()
                  .HasForeignKey(l => l.CreatedBy)
                  .OnDelete(DeleteBehavior.SetNull);
            entity.HasIndex(l => l.Category);
            entity.HasIndex(l => l.CreatedBy);
        });

        builder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(r => r.Id);
            entity.Property(r => r.TokenHash).HasMaxLength(512).IsRequired();
            entity.Property(r => r.CreatedAt).HasColumnType("timestamptz");
            entity.Property(r => r.ExpiresAt).HasColumnType("timestamptz");
            entity.Property(r => r.RevokedAt).HasColumnType("timestamptz");
            entity.HasOne(r => r.User)
                  .WithMany(u => u.RefreshTokens)
                  .HasForeignKey(r => r.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(r => r.TokenHash);
            entity.HasIndex(r => r.UserId);
        });
    }
}
