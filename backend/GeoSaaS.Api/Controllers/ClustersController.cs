using GeoSaaS.Api.DTOs;
using GeoSaaS.Api.DTOs.Locations;
using GeoSaaS.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GeoSaaS.Api.Controllers;

[ApiController]
[Route("api/locations/clusters")]
[Authorize]
public class ClustersController : ControllerBase
{
    private readonly IClusterService _clusters;

    public ClustersController(IClusterService clusters) => _clusters = clusters;

    [HttpGet]
    public async Task<IActionResult> GetClusters(
        [FromQuery] double minLat,
        [FromQuery] double maxLat,
        [FromQuery] double minLng,
        [FromQuery] double maxLng,
        [FromQuery] int zoom = 5)
    {
        zoom = Math.Clamp(zoom, 0, 20);
        var clusters = await _clusters.GetClustersAsync(minLat, maxLat, minLng, maxLng, zoom);
        return Ok(ApiResponse<IEnumerable<ClusterResponse>>.Ok(clusters));
    }
}
