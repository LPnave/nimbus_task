using GeoSaaS.Api.DTOs.Auth;

namespace GeoSaaS.Api.Services;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<(AuthResponse Auth, string RawRefreshToken)> LoginAsync(LoginRequest request);
    Task<string> RefreshAsync(string rawRefreshToken);
    Task LogoutAsync(string rawRefreshToken);
}
