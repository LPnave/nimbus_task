using System.Security.Claims;
using GeoSaaS.Api.DTOs;
using GeoSaaS.Api.DTOs.Locations;
using GeoSaaS.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GeoSaaS.Api.Controllers;

[ApiController]
[Route("api/locations")]
[Authorize]
public class LocationsController : ControllerBase
{
    private readonly ILocationService _locations;

    public LocationsController(ILocationService locations) => _locations = locations;

    private string CurrentUserId =>
        User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? User.FindFirstValue("sub")
        ?? throw new UnauthorizedAccessException("User ID not found in token.");

    [HttpGet]
    public async Task<IActionResult> List(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        [FromQuery] string? category = null,
        [FromQuery] double? minLat = null,
        [FromQuery] double? maxLat = null,
        [FromQuery] double? minLng = null,
        [FromQuery] double? maxLng = null)
    {
        page = Math.Max(1, page);

        var hasBbox = minLat.HasValue && maxLat.HasValue && minLng.HasValue && maxLng.HasValue;
        pageSize = hasBbox
            ? Math.Clamp(pageSize, 1, 500)
            : Math.Clamp(pageSize, 1, 200);

        var (items, total) = await _locations.ListAsync(page, pageSize, category, minLat, maxLat, minLng, maxLng);
        var meta = new PagedMeta(page, pageSize, total);
        return Ok(ApiResponse<IEnumerable<LocationResponse>>.Ok(items, meta));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var loc = await _locations.GetByIdAsync(id);
        if (loc is null)
            return NotFound(ApiResponse<object>.Fail("Location not found."));

        return Ok(ApiResponse<LocationResponse>.Ok(loc));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] LocationRequest request)
    {
        var loc = await _locations.CreateAsync(request, CurrentUserId);
        return CreatedAtAction(nameof(GetById), new { id = loc.Id },
            ApiResponse<LocationResponse>.Ok(loc));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] LocationRequest request)
    {
        var loc = await _locations.UpdateAsync(id, request, CurrentUserId);
        return Ok(ApiResponse<LocationResponse>.Ok(loc));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _locations.DeleteAsync(id, CurrentUserId);
        return Ok(ApiResponse<object>.Ok(new { }));
    }
}
