using GeoSaaS.Api.Data;
using GeoSaaS.Api.DTOs.Locations;
using GeoSaaS.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace GeoSaaS.Api.Services;

public class LocationService : ILocationService
{
    private readonly AppDbContext _db;

    public LocationService(AppDbContext db) => _db = db;

    public async Task<(IEnumerable<LocationResponse> Items, int Total)> ListAsync(
        int page, int pageSize, string? category,
        double? minLat = null, double? maxLat = null,
        double? minLng = null, double? maxLng = null)
    {
        var query = _db.Locations.AsQueryable();

        if (!string.IsNullOrWhiteSpace(category))
            query = query.Where(l => l.Category == category);

        if (minLat.HasValue && maxLat.HasValue && minLng.HasValue && maxLng.HasValue)
        {
            query = query.Where(l =>
                l.Latitude >= minLat.Value && l.Latitude <= maxLat.Value &&
                l.Longitude >= minLng.Value && l.Longitude <= maxLng.Value);
        }

        var total = await query.CountAsync();

        var items = await query
            .OrderByDescending(l => l.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(l => ToResponse(l))
            .ToListAsync();

        return (items, total);
    }

    public async Task<LocationResponse?> GetByIdAsync(Guid id)
    {
        var loc = await _db.Locations.FindAsync(id);
        return loc is null ? null : ToResponse(loc);
    }

    public async Task<LocationResponse> CreateAsync(LocationRequest request, string userId)
    {
        var loc = new Location
        {
            Name = request.Name,
            Description = request.Description ?? string.Empty,
            Category = request.Category,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            CreatedBy = userId,
        };

        _db.Locations.Add(loc);
        await _db.SaveChangesAsync();
        return ToResponse(loc);
    }

    public async Task<LocationResponse> UpdateAsync(Guid id, LocationRequest request, string userId)
    {
        var loc = await _db.Locations.FindAsync(id)
            ?? throw new KeyNotFoundException("Location not found.");

        loc.Name = request.Name;
        loc.Description = request.Description ?? string.Empty;
        loc.Category = request.Category;
        loc.Latitude = request.Latitude;
        loc.Longitude = request.Longitude;
        loc.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return ToResponse(loc);
    }

    public async Task DeleteAsync(Guid id, string userId)
    {
        var loc = await _db.Locations.FindAsync(id)
            ?? throw new KeyNotFoundException("Location not found.");

        _db.Locations.Remove(loc);
        await _db.SaveChangesAsync();
    }

    private static LocationResponse ToResponse(Location l) => new(
        l.Id, l.Name, l.Description, l.Category,
        l.Latitude, l.Longitude, l.CreatedBy,
        l.CreatedAt, l.UpdatedAt);
}
