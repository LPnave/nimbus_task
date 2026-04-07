using GeoSaaS.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace GeoSaaS.Api.Data;

public static class SeedData
{
    public static async Task InitializeAsync(IServiceProvider services)
    {
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
        var db = services.GetRequiredService<AppDbContext>();
        var logger = services.GetRequiredService<ILogger<AppDbContext>>();

        // Seed users
        var demo1 = await EnsureUserAsync(userManager, "demo@geosaas.io", "Password1!", "Demo User");
        var demo2 = await EnsureUserAsync(userManager, "demo2@geosaas.io", "Password1!", "Alex Chen");

        if (await db.Locations.AnyAsync())
        {
            logger.LogInformation("Seed data already present, skipping.");
            return;
        }

        logger.LogInformation("Seeding 35 locations...");

        var locations = new List<Location>
        {
            // Coffee Shops
            new() { Name = "Monmouth Coffee Covent Garden", Category = "Coffee Shops", Description = "Legendary specialty coffee roaster in the heart of London.", Latitude = 51.5132, Longitude = -0.1237, CreatedBy = demo1.Id },
            new() { Name = "Blue Bottle Coffee", Category = "Coffee Shops", Description = "Premium single-origin coffee in New York's Williamsburg.", Latitude = 40.7128, Longitude = -74.0060, CreatedBy = demo1.Id },
            new() { Name = "Fuglen Tokyo", Category = "Coffee Shops", Description = "Oslo-Tokyo hybrid café with vintage Scandinavian design.", Latitude = 35.6762, Longitude = 139.6503, CreatedBy = demo1.Id },
            new() { Name = "Stumptown Coffee Roasters", Category = "Coffee Shops", Description = "Portland's iconic specialty roaster, Lower East Side NYC.", Latitude = 40.7215, Longitude = -73.9875, CreatedBy = demo2.Id },
            new() { Name = "Café Verlet", Category = "Coffee Shops", Description = "Parisian institution since 1880, Palais Royal district.", Latitude = 48.8638, Longitude = 2.3393, CreatedBy = demo2.Id },
            new() { Name = "Five Elephant", Category = "Coffee Shops", Description = "Berlin's finest specialty coffee and cheesecake.", Latitude = 52.4992, Longitude = 13.4211, CreatedBy = demo1.Id },

            // Parks
            new() { Name = "Hyde Park", Category = "Parks", Description = "One of London's Royal Parks, covering 350 acres.", Latitude = 51.5073, Longitude = -0.1657, CreatedBy = demo1.Id },
            new() { Name = "Central Park", Category = "Parks", Description = "New York's iconic 843-acre urban park.", Latitude = 40.7851, Longitude = -73.9683, CreatedBy = demo1.Id },
            new() { Name = "Shinjuku Gyoen", Category = "Parks", Description = "Tokyo national garden with Japanese, French, and English zones.", Latitude = 35.6852, Longitude = 139.7100, CreatedBy = demo2.Id },
            new() { Name = "Tiergarten", Category = "Parks", Description = "Berlin's largest inner-city park, historic woodland.", Latitude = 52.5145, Longitude = 13.3501, CreatedBy = demo2.Id },
            new() { Name = "Tuileries Garden", Category = "Parks", Description = "Formal garden between the Louvre and Place de la Concorde.", Latitude = 48.8638, Longitude = 2.3285, CreatedBy = demo1.Id },
            new() { Name = "Royal Botanic Gardens", Category = "Parks", Description = "Kew Gardens UNESCO World Heritage Site.", Latitude = 51.4787, Longitude = -0.2956, CreatedBy = demo1.Id },

            // Offices
            new() { Name = "WeWork Moorgate", Category = "Offices", Description = "Premium co-working space in the City of London.", Latitude = 51.5193, Longitude = -0.0886, CreatedBy = demo2.Id },
            new() { Name = "Google NYC HQ", Category = "Offices", Description = "Google's main New York office at 111 Eighth Avenue.", Latitude = 40.7416, Longitude = -74.0010, CreatedBy = demo2.Id },
            new() { Name = "Roppongi Hills Mori Tower", Category = "Offices", Description = "Tokyo's landmark mixed-use skyscraper, 54 floors.", Latitude = 35.6604, Longitude = 139.7293, CreatedBy = demo1.Id },
            new() { Name = "Station F", Category = "Offices", Description = "World's largest startup campus, 13th arrondissement Paris.", Latitude = 48.8374, Longitude = 2.3682, CreatedBy = demo1.Id },
            new() { Name = "Factory Berlin Görlitzer Bahnhof", Category = "Offices", Description = "Historic venue turned tech campus in Kreuzberg.", Latitude = 52.4993, Longitude = 13.4342, CreatedBy = demo2.Id },

            // Restaurants
            new() { Name = "Dishoom Covent Garden", Category = "Restaurants", Description = "Iconic Bombay café-inspired restaurant, London.", Latitude = 51.5117, Longitude = -0.1240, CreatedBy = demo1.Id },
            new() { Name = "Le Bernardin", Category = "Restaurants", Description = "Three Michelin star French seafood, Midtown Manhattan.", Latitude = 40.7613, Longitude = -73.9818, CreatedBy = demo2.Id },
            new() { Name = "Sukiyabashi Jiro Honten", Category = "Restaurants", Description = "World-famous sushi in Tokyo's Ginza district.", Latitude = 35.6717, Longitude = 139.7641, CreatedBy = demo1.Id },
            new() { Name = "L'Ami Jean", Category = "Restaurants", Description = "Legendary Basque bistro in the 7th arrondissement.", Latitude = 48.8587, Longitude = 2.3066, CreatedBy = demo2.Id },
            new() { Name = "Nobelhart & Schmutzig", Category = "Restaurants", Description = "Berlin's brutally local cuisine on Friedrichstrasse.", Latitude = 52.5078, Longitude = 13.3892, CreatedBy = demo1.Id },
            new() { Name = "Hawker Chan", Category = "Restaurants", Description = "Singapore's Michelin-starred soy chicken rice.", Latitude = 1.2803, Longitude = 103.8440, CreatedBy = demo2.Id },

            // Hotels
            new() { Name = "The Savoy", Category = "Hotels", Description = "London's most iconic luxury hotel on the Strand.", Latitude = 51.5104, Longitude = -0.1201, CreatedBy = demo2.Id },
            new() { Name = "The Standard High Line", Category = "Hotels", Description = "Ultra-stylish hotel straddling the High Line, NYC.", Latitude = 40.7479, Longitude = -74.0046, CreatedBy = demo1.Id },
            new() { Name = "Aman Tokyo", Category = "Hotels", Description = "Sanctuary in the sky at the top of Otemachi Tower.", Latitude = 35.6868, Longitude = 139.7648, CreatedBy = demo1.Id },
            new() { Name = "Hôtel Plaza Athénée", Category = "Hotels", Description = "Fashion district palace hotel on Avenue Montaigne.", Latitude = 48.8665, Longitude = 2.3034, CreatedBy = demo2.Id },
            new() { Name = "Hotel de Rome", Category = "Hotels", Description = "Historic former bank on Bebelplatz, Berlin.", Latitude = 52.5172, Longitude = 13.3928, CreatedBy = demo1.Id },

            // Landmarks
            new() { Name = "Tower Bridge", Category = "Landmarks", Description = "Victorian Gothic bascule bridge, London's most famous landmark.", Latitude = 51.5055, Longitude = -0.0754, CreatedBy = demo1.Id },
            new() { Name = "Statue of Liberty", Category = "Landmarks", Description = "Symbol of freedom on Liberty Island, New York Harbor.", Latitude = 40.6892, Longitude = -74.0445, CreatedBy = demo2.Id },
            new() { Name = "Tokyo Skytree", Category = "Landmarks", Description = "World's second tallest structure at 634 metres.", Latitude = 35.7101, Longitude = 139.8107, CreatedBy = demo1.Id },
            new() { Name = "Eiffel Tower", Category = "Landmarks", Description = "Gustave Eiffel's 1889 iron lattice masterpiece.", Latitude = 48.8584, Longitude = 2.2945, CreatedBy = demo2.Id },
            new() { Name = "Brandenburg Gate", Category = "Landmarks", Description = "Neoclassical monument, symbol of German reunification.", Latitude = 52.5163, Longitude = 13.3777, CreatedBy = demo1.Id },
            new() { Name = "Marina Bay Sands", Category = "Landmarks", Description = "Iconic integrated resort with infinity pool, Singapore.", Latitude = 1.2834, Longitude = 103.8607, CreatedBy = demo2.Id },
        };

        db.Locations.AddRange(locations);
        await db.SaveChangesAsync();
        logger.LogInformation("Seeded {Count} locations.", locations.Count);
    }

    private static async Task<ApplicationUser> EnsureUserAsync(
        UserManager<ApplicationUser> userManager,
        string email, string password, string name)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user is not null) return user;

        user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            Name = name,
            EmailConfirmed = true,
        };

        var result = await userManager.CreateAsync(user, password);
        if (!result.Succeeded)
            throw new InvalidOperationException(
                $"Failed to seed user {email}: {string.Join(", ", result.Errors.Select(e => e.Description))}");

        return user;
    }
}
