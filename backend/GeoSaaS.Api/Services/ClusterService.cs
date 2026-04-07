using System.Text.Json;
using GeoSaaS.Api.Data;
using GeoSaaS.Api.DTOs.Locations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Npgsql;

namespace GeoSaaS.Api.Services;

public class ClusterService : IClusterService
{
    private readonly AppDbContext _db;
    private readonly IDistributedCache _cache;

    public ClusterService(AppDbContext db, IDistributedCache cache)
    {
        _db = db;
        _cache = cache;
    }

    private static int GetGeohashPrecision(int zoom) => zoom switch
    {
        <= 4  => 2,
        <= 7  => 3,
        <= 10 => 4,
        <= 13 => 5,
        _     => 6,
    };

    public async Task<IEnumerable<ClusterResponse>> GetClustersAsync(
        double minLat, double maxLat, double minLng, double maxLng, int zoom)
    {
        var precision = GetGeohashPrecision(zoom);
        var cacheKey = $"clusters:z{zoom}:p{precision}:{minLat:F2}:{maxLat:F2}:{minLng:F2}:{maxLng:F2}";

        var cached = await _cache.GetStringAsync(cacheKey);
        if (cached is not null)
            return JsonSerializer.Deserialize<List<ClusterResponse>>(cached) ?? [];

        var conn = (NpgsqlConnection)_db.Database.GetDbConnection();
        await conn.OpenAsync();

        var results = new List<ClusterResponse>();
        try
        {
            var sql = $"""
                SELECT
                    LEFT(ST_GeoHash(ST_SetSRID(ST_Point("Longitude", "Latitude"), 4326)), {precision}) AS cell,
                    COUNT(*)::int AS count,
                    AVG("Latitude") AS lat,
                    AVG("Longitude") AS lng
                FROM "Locations"
                WHERE "Latitude" >= @minLat AND "Latitude" <= @maxLat
                  AND "Longitude" >= @minLng AND "Longitude" <= @maxLng
                GROUP BY LEFT(ST_GeoHash(ST_SetSRID(ST_Point("Longitude", "Latitude"), 4326)), {precision})
                """;

            await using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("minLat", minLat);
            cmd.Parameters.AddWithValue("maxLat", maxLat);
            cmd.Parameters.AddWithValue("minLng", minLng);
            cmd.Parameters.AddWithValue("maxLng", maxLng);

            await using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                results.Add(new ClusterResponse(
                    Lat:   reader.GetDouble(2),
                    Lng:   reader.GetDouble(3),
                    Count: reader.GetInt32(1),
                    Cell:  reader.GetString(0)
                ));
            }
        }
        finally
        {
            await conn.CloseAsync();
        }

        var cacheOptions = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
        };
        await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(results), cacheOptions);

        return results;
    }
}
