namespace GeoSaaS.Api.Utils;

public static class TileUtils
{
    public record BoundingBox(double MinLng, double MinLat, double MaxLng, double MaxLat);

    public static BoundingBox TileToBBox(int z, int x, int y)
    {
        var n = Math.Pow(2, z);
        var minLng = x / n * 360.0 - 180.0;
        var maxLng = (x + 1) / n * 360.0 - 180.0;
        var maxLat = Math.Atan(Math.Sinh(Math.PI * (1 - 2.0 * y / n))) * 180.0 / Math.PI;
        var minLat = Math.Atan(Math.Sinh(Math.PI * (1 - 2.0 * (y + 1) / n))) * 180.0 / Math.PI;
        return new BoundingBox(minLng, minLat, maxLng, maxLat);
    }
}
