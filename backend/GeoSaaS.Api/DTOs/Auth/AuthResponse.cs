namespace GeoSaaS.Api.DTOs.Auth;

public record AuthResponse(string AccessToken, UserDto User);

public record UserDto(string Id, string Email, string Name);

public record RefreshResponse(string AccessToken);
