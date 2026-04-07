using GeoSaaS.Api.DTOs;
using GeoSaaS.Api.DTOs.Locations;

namespace GeoSaaS.Api.Services;

public interface ILocationService
{
    Task<(IEnumerable<LocationResponse> Items, int Total)> ListAsync(
        int page, int pageSize, string? category,
        double? minLat = null, double? maxLat = null,
        double? minLng = null, double? maxLng = null);

    Task<LocationResponse?> GetByIdAsync(Guid id);

    Task<LocationResponse> CreateAsync(LocationRequest request, string userId);

    Task<LocationResponse> UpdateAsync(Guid id, LocationRequest request, string userId);

    Task DeleteAsync(Guid id, string userId);
}
