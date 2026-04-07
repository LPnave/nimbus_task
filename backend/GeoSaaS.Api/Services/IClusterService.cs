using GeoSaaS.Api.DTOs.Locations;

namespace GeoSaaS.Api.Services;

public interface IClusterService
{
    Task<IEnumerable<ClusterResponse>> GetClustersAsync(
        double minLat, double maxLat, double minLng, double maxLng, int zoom);
}
