namespace GeoSaaS.Api.DTOs.Locations;

public record LocationResponse(
    Guid Id,
    string Name,
    string Description,
    string Category,
    double Latitude,
    double Longitude,
    string CreatedBy,
    DateTime CreatedAt,
    DateTime UpdatedAt
);
