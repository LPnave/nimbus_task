using GeoSaaS.Api.DTOs;
using GeoSaaS.Api.DTOs.Auth;
using GeoSaaS.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace GeoSaaS.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;
    private readonly ILogger<AuthController> _logger;

    private const string RefreshTokenCookie = "refreshToken";
    private static readonly CookieOptions CookieOpts = new()
    {
        HttpOnly = true,
        Secure = false,   // set true in production behind HTTPS
        SameSite = SameSiteMode.Lax,
        MaxAge = TimeSpan.FromDays(7),
        Path = "/api/auth",
    };

    public AuthController(IAuthService auth, ILogger<AuthController> logger)
    {
        _auth = auth;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var auth = await _auth.RegisterAsync(request);
        _logger.LogInformation("New user registered: {Email}", request.Email);
        return Ok(ApiResponse<AuthResponse>.Ok(auth));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var (auth, rawRefreshToken) = await _auth.LoginAsync(request);

        Response.Cookies.Append(RefreshTokenCookie, rawRefreshToken, CookieOpts);

        _logger.LogInformation("User logged in: {Email}", request.Email);
        return Ok(ApiResponse<AuthResponse>.Ok(auth));
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var rawToken = Request.Cookies[RefreshTokenCookie];
        if (string.IsNullOrEmpty(rawToken))
            return Unauthorized(ApiResponse<object>.Fail("Refresh token missing."));

        var newAccessToken = await _auth.RefreshAsync(rawToken);
        return Ok(ApiResponse<RefreshResponse>.Ok(new RefreshResponse(newAccessToken)));
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var rawToken = Request.Cookies[RefreshTokenCookie];
        if (!string.IsNullOrEmpty(rawToken))
            await _auth.LogoutAsync(rawToken);

        Response.Cookies.Delete(RefreshTokenCookie, new CookieOptions { Path = "/api/auth" });
        return Ok(ApiResponse<object>.Ok(new { }));
    }
}
