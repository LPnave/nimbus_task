using System.ComponentModel.DataAnnotations;

namespace GeoSaaS.Api.DTOs.Auth;

public record LoginRequest(
    [Required, EmailAddress] string Email,
    [Required] string Password
);
