using System.ComponentModel.DataAnnotations;

namespace GeoSaaS.Api.DTOs.Auth;

public record RegisterRequest(
    [Required, MinLength(2), MaxLength(100)] string Name,
    [Required, EmailAddress] string Email,
    [Required, MinLength(8)] string Password
);
