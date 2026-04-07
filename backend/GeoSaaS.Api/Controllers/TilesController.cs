using GeoSaaS.Api.Data;
using GeoSaaS.Api.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace GeoSaaS.Api.Controllers;

[ApiController]
[Route("api/tiles")]
[Authorize]
public class TilesController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ILogger<TilesController> _logger;

    public TilesController(AppDbContext db, ILogger<TilesController> logger)
    {
        _db = db;
        _logger = logger;
    }

    [HttpGet("{z:int}/{x:int}/{y:int}.mvt")]
    [ResponseCache(Duration = 3600, Location = ResponseCacheLocation.Any, VaryByHeader = "Authorization")]
    public async Task<IActionResult> GetTile(int z, int x, int y)
    {
        z = Math.Clamp(z, 0, 20);

        var conn = (Npgsql.NpgsqlConnection)_db.Database.GetDbConnection();
        await conn.OpenAsync();

        try
        {
            const string sql = """
                SELECT ST_AsMVT(tile, 'locations', 4096, 'geom')
                FROM (
                    SELECT
                        "Id"::text AS id,
                        "Name" AS name,
                        "Category" AS category,
                        ST_AsMVTGeom(
                            ST_SetSRID(ST_Point("Longitude", "Latitude"), 4326),
                            ST_TileEnvelope(@z, @x, @y),
                            4096, 64, true
                        ) AS geom
                    FROM "Locations"
                    WHERE ST_Intersects(
                        ST_SetSRID(ST_Point("Longitude", "Latitude"), 4326),
                        ST_TileEnvelope(@z, @x, @y)
                    )
                ) tile
                """;

            await using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("z", z);
            cmd.Parameters.AddWithValue("x", x);
            cmd.Parameters.AddWithValue("y", y);

            var result = await cmd.ExecuteScalarAsync();
            var mvtBytes = result as byte[] ?? [];

            Response.Headers["Cache-Control"] = "public, max-age=3600";
            return File(mvtBytes, "application/x-protobuf");
        }
        finally
        {
            await conn.CloseAsync();
        }
    }
}
