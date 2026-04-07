namespace GeoSaaS.Api.DTOs;

public record ApiResponse<T>(T? Data, string? Error = null, PagedMeta? Meta = null)
{
    public static ApiResponse<T> Ok(T data, PagedMeta? meta = null) =>
        new(data, null, meta);

    public static ApiResponse<T> Fail(string error) =>
        new(default, error, null);
}

public record PagedMeta(int Page, int PageSize, int Total);
