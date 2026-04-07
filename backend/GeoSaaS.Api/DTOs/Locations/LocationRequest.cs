using System.ComponentModel.DataAnnotations;

namespace GeoSaaS.Api.DTOs.Locations;

public record LocationRequest(
    [Required, MinLength(2), MaxLength(255)] string Name,
    string Description,
    [Required, MaxLength(100)] string Category,
    [Range(-90, 90)] double Latitude,
    [Range(-180, 180)] double Longitude
);
