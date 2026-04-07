using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GeoSaaS.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddSpatialIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("CREATE EXTENSION IF NOT EXISTS postgis;");

            migrationBuilder.Sql(@"
                CREATE INDEX IF NOT EXISTS locations_spatial_idx
                ON ""Locations""
                USING GIST (ST_SetSRID(ST_Point(""Longitude"", ""Latitude""), 4326));
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DROP INDEX IF EXISTS locations_spatial_idx;");
        }
    }
}
