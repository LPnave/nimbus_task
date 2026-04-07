using GeoSaaS.Api.Models;
using Microsoft.AspNetCore.Identity;
using BC = BCrypt.Net.BCrypt;

namespace GeoSaaS.Api.Services;

public class BcryptPasswordHasher : IPasswordHasher<ApplicationUser>
{
    public string HashPassword(ApplicationUser user, string password) =>
        BC.HashPassword(password, BC.GenerateSalt(12));

    public PasswordVerificationResult VerifyHashedPassword(
        ApplicationUser user, string hashedPassword, string providedPassword)
    {
        return BC.Verify(providedPassword, hashedPassword)
            ? PasswordVerificationResult.Success
            : PasswordVerificationResult.Failed;
    }
}
