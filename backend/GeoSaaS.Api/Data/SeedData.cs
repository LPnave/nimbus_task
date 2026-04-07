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

        logger.LogInformation("Seeding 200 locations...");

        var locations = new List<Location>
        {
            // ── Coffee Shops (28) ──────────────────────────────────────────────────
            new() { Name = "Monmouth Coffee Covent Garden", Category = "Coffee Shops", Description = "Legendary specialty coffee roaster in the heart of London.", Latitude = 51.5132, Longitude = -0.1237, CreatedBy = demo1.Id },
            new() { Name = "Blue Bottle Coffee", Category = "Coffee Shops", Description = "Premium single-origin coffee in New York's Williamsburg.", Latitude = 40.7128, Longitude = -74.0060, CreatedBy = demo1.Id },
            new() { Name = "Fuglen Tokyo", Category = "Coffee Shops", Description = "Oslo-Tokyo hybrid café with vintage Scandinavian design.", Latitude = 35.6762, Longitude = 139.6503, CreatedBy = demo1.Id },
            new() { Name = "Stumptown Coffee Roasters", Category = "Coffee Shops", Description = "Portland's iconic specialty roaster, Lower East Side NYC.", Latitude = 40.7215, Longitude = -73.9875, CreatedBy = demo2.Id },
            new() { Name = "Café Verlet", Category = "Coffee Shops", Description = "Parisian institution since 1880, Palais Royal district.", Latitude = 48.8638, Longitude = 2.3393, CreatedBy = demo2.Id },
            new() { Name = "Five Elephant", Category = "Coffee Shops", Description = "Berlin's finest specialty coffee and cheesecake.", Latitude = 52.4992, Longitude = 13.4211, CreatedBy = demo1.Id },
            new() { Name = "Proud Mary Coffee", Category = "Coffee Shops", Description = "Melbourne's celebrated specialty roaster known for its bright, complex blends.", Latitude = -37.8136, Longitude = 144.9631, CreatedBy = demo2.Id },
            new() { Name = "Single O Surry Hills", Category = "Coffee Shops", Description = "Sydney's pioneer of direct-trade specialty coffee since 2003.", Latitude = -33.8871, Longitude = 151.2099, CreatedBy = demo1.Id },
            new() { Name = "The Cupping Room", Category = "Coffee Shops", Description = "Hong Kong's premier specialty coffee destination in Central.", Latitude = 22.2831, Longitude = 114.1541, CreatedBy = demo2.Id },
            new() { Name = "Tim Wendelboe", Category = "Coffee Shops", Description = "Oslo micro-roastery from World Barista Champion Tim Wendelboe.", Latitude = 59.9220, Longitude = 10.7578, CreatedBy = demo1.Id },
            new() { Name = "Drop Coffee", Category = "Coffee Shops", Description = "Stockholm specialty roastery focusing on traceable single origins.", Latitude = 59.3151, Longitude = 18.0469, CreatedBy = demo2.Id },
            new() { Name = "Intelligentsia Coffee", Category = "Coffee Shops", Description = "Chicago's landmark specialty roaster on Monadnock Building corner.", Latitude = 41.8781, Longitude = -87.6298, CreatedBy = demo1.Id },
            new() { Name = "Revolver Coffee", Category = "Coffee Shops", Description = "Vancouver's beloved Gastown espresso bar, obsessed with craft.", Latitude = 49.2840, Longitude = -123.1068, CreatedBy = demo2.Id },
            new() { Name = "Pilot Coffee Roasters", Category = "Coffee Shops", Description = "Toronto's award-winning roastery sourcing coffees from small farms.", Latitude = 43.6441, Longitude = -79.4003, CreatedBy = demo1.Id },
            new() { Name = "Coffee Collective", Category = "Coffee Shops", Description = "Copenhagen worker-owned roastery championing fair-trade ethics.", Latitude = 55.6867, Longitude = 12.5667, CreatedBy = demo2.Id },
            new() { Name = "Blacksmith Coffee", Category = "Coffee Shops", Description = "Dubai's artisan café inside Alserkal Avenue arts district.", Latitude = 25.1580, Longitude = 55.2213, CreatedBy = demo1.Id },
            new() { Name = "Koffie Academie", Category = "Coffee Shops", Description = "Amsterdam specialty coffee school and brew bar in De Pijp.", Latitude = 52.3556, Longitude = 4.8955, CreatedBy = demo2.Id },
            new() { Name = "Nomad Coffee", Category = "Coffee Shops", Description = "Barcelona's pioneering roastery in the heart of Eixample.", Latitude = 41.3948, Longitude = 2.1576, CreatedBy = demo1.Id },
            new() { Name = "Fritz Coffee Company", Category = "Coffee Shops", Description = "Seoul's beloved specialty roaster in Mapo, loved for its culture.", Latitude = 37.5496, Longitude = 126.9108, CreatedBy = demo2.Id },
            new() { Name = "% Arabica Kyoto", Category = "Coffee Shops", Description = "Minimalist coffee bar beside the Higashiyama canal in Kyoto.", Latitude = 35.0035, Longitude = 135.7717, CreatedBy = demo1.Id },
            new() { Name = "Sightglass Coffee", Category = "Coffee Shops", Description = "San Francisco industrial-chic roastery in SoMa neighbourhood.", Latitude = 37.7785, Longitude = -122.4079, CreatedBy = demo2.Id },
            new() { Name = "Panther Coffee", Category = "Coffee Shops", Description = "Miami's specialty coffee leader, roasting in Wynwood arts district.", Latitude = 25.8000, Longitude = -80.1991, CreatedBy = demo1.Id },
            new() { Name = "Father Coffee", Category = "Coffee Shops", Description = "Johannesburg's third-wave coffee destination in Rosebank.", Latitude = -26.1474, Longitude = 28.0435, CreatedBy = demo2.Id },
            new() { Name = "Blue Tokai Coffee", Category = "Coffee Shops", Description = "Mumbai specialty roaster sourcing exclusively from Indian estates.", Latitude = 19.1136, Longitude = 72.8697, CreatedBy = demo1.Id },
            new() { Name = "Onibus Coffee Nakameguro", Category = "Coffee Shops", Description = "Tokyo roastery in a converted garage on the Meguro riverside.", Latitude = 35.6409, Longitude = 139.6993, CreatedBy = demo2.Id },
            new() { Name = "Dak Lak Coffee", Category = "Coffee Shops", Description = "Ho Chi Minh City café celebrating Vietnam's highland coffee origins.", Latitude = 10.7769, Longitude = 106.7009, CreatedBy = demo1.Id },
            new() { Name = "Hacienda Coffee", Category = "Coffee Shops", Description = "Mexico City's rooftop café sourcing from Veracruz and Chiapas.", Latitude = 19.4326, Longitude = -99.1332, CreatedBy = demo2.Id },
            new() { Name = "La Marzocco Café", Category = "Coffee Shops", Description = "Istanbul specialty café inside Karaköy's creative quarter.", Latitude = 41.0236, Longitude = 28.9744, CreatedBy = demo1.Id },

            // ── Parks (29) ────────────────────────────────────────────────────────
            new() { Name = "Hyde Park", Category = "Parks", Description = "One of London's Royal Parks, covering 350 acres.", Latitude = 51.5073, Longitude = -0.1657, CreatedBy = demo1.Id },
            new() { Name = "Central Park", Category = "Parks", Description = "New York's iconic 843-acre urban park.", Latitude = 40.7851, Longitude = -73.9683, CreatedBy = demo1.Id },
            new() { Name = "Shinjuku Gyoen", Category = "Parks", Description = "Tokyo national garden with Japanese, French, and English zones.", Latitude = 35.6852, Longitude = 139.7100, CreatedBy = demo2.Id },
            new() { Name = "Tiergarten", Category = "Parks", Description = "Berlin's largest inner-city park, historic woodland.", Latitude = 52.5145, Longitude = 13.3501, CreatedBy = demo2.Id },
            new() { Name = "Tuileries Garden", Category = "Parks", Description = "Formal garden between the Louvre and Place de la Concorde.", Latitude = 48.8638, Longitude = 2.3285, CreatedBy = demo1.Id },
            new() { Name = "Royal Botanic Gardens Kew", Category = "Parks", Description = "Kew Gardens UNESCO World Heritage Site.", Latitude = 51.4787, Longitude = -0.2956, CreatedBy = demo1.Id },
            new() { Name = "Stanley Park", Category = "Parks", Description = "Vancouver's 1,001-acre forested park with seawall and beaches.", Latitude = 49.3017, Longitude = -123.1417, CreatedBy = demo2.Id },
            new() { Name = "High Park", Category = "Parks", Description = "Toronto's largest public park, famous for cherry blossoms.", Latitude = 43.6465, Longitude = -79.4637, CreatedBy = demo1.Id },
            new() { Name = "Royal Botanic Garden Sydney", Category = "Parks", Description = "Sydney's oldest scientific institution on the harbour foreshore.", Latitude = -33.8642, Longitude = 151.2166, CreatedBy = demo2.Id },
            new() { Name = "Vondelpark", Category = "Parks", Description = "Amsterdam's beloved 47-hectare Victorian-era recreational park.", Latitude = 52.3579, Longitude = 4.8686, CreatedBy = demo1.Id },
            new() { Name = "Retiro Park", Category = "Parks", Description = "Madrid's magnificent 350-acre park with a boating lake.", Latitude = 40.4153, Longitude = -3.6844, CreatedBy = demo2.Id },
            new() { Name = "Villa Borghese", Category = "Parks", Description = "Rome's celebrated landscape garden housing the Borghese Gallery.", Latitude = 41.9141, Longitude = 12.4923, CreatedBy = demo1.Id },
            new() { Name = "Parc de la Ciutadella", Category = "Parks", Description = "Barcelona's green lung with a monumental fountain and lake.", Latitude = 41.3888, Longitude = 2.1860, CreatedBy = demo2.Id },
            new() { Name = "Englischer Garten", Category = "Parks", Description = "Munich's English Garden — larger than New York's Central Park.", Latitude = 48.1642, Longitude = 11.6051, CreatedBy = demo1.Id },
            new() { Name = "Chapultepec Park", Category = "Parks", Description = "Mexico City's 686-hectare forest park, one of the world's largest.", Latitude = 19.4150, Longitude = -99.1921, CreatedBy = demo2.Id },
            new() { Name = "Ibirapuera Park", Category = "Parks", Description = "São Paulo's cultural and ecological heart, designed by Oscar Niemeyer.", Latitude = -23.5874, Longitude = -46.6576, CreatedBy = demo1.Id },
            new() { Name = "Lodhi Garden", Category = "Parks", Description = "Delhi heritage park containing 15th-century Mughal tombs.", Latitude = 28.5932, Longitude = 77.2195, CreatedBy = demo2.Id },
            new() { Name = "Table Mountain National Park", Category = "Parks", Description = "Cape Town's iconic flat-topped mountain and surrounding fynbos.", Latitude = -33.9628, Longitude = 18.4098, CreatedBy = demo1.Id },
            new() { Name = "Namsan Park", Category = "Parks", Description = "Seoul's central forested mountain topped by N Seoul Tower.", Latitude = 37.5512, Longitude = 126.9882, CreatedBy = demo2.Id },
            new() { Name = "Phoenix Park", Category = "Parks", Description = "Dublin's 1,752-acre park, home to a herd of wild fallow deer.", Latitude = 53.3600, Longitude = -6.3214, CreatedBy = demo1.Id },
            new() { Name = "Parc du Mont-Royal", Category = "Parks", Description = "Montreal's wooded hilltop park designed by Frederick Law Olmsted.", Latitude = 45.5048, Longitude = -73.5878, CreatedBy = demo2.Id },
            new() { Name = "Lumpini Park", Category = "Parks", Description = "Bangkok's 142-acre urban oasis with a lake and monitor lizards.", Latitude = 13.7281, Longitude = 100.5418, CreatedBy = demo1.Id },
            new() { Name = "Perdana Botanical Garden", Category = "Parks", Description = "Kuala Lumpur's verdant lake garden near the colonial city centre.", Latitude = 3.1436, Longitude = 101.6863, CreatedBy = demo2.Id },
            new() { Name = "Emirgan Park", Category = "Parks", Description = "Istanbul's Bosphorus-side woodland, famous for its tulip festival.", Latitude = 41.1073, Longitude = 29.0579, CreatedBy = demo1.Id },
            new() { Name = "Ueno Park", Category = "Parks", Description = "Tokyo's cultural park housing major museums and a cherry blossom avenue.", Latitude = 35.7148, Longitude = 139.7730, CreatedBy = demo2.Id },
            new() { Name = "Al Safa Park", Category = "Parks", Description = "Dubai's family park in Jumeirah with cycling paths and a lake.", Latitude = 25.1852, Longitude = 55.2423, CreatedBy = demo1.Id },
            new() { Name = "Gorky Park", Category = "Parks", Description = "Moscow's riverfront cultural park redesigned as a modern leisure space.", Latitude = 55.7298, Longitude = 37.6010, CreatedBy = demo2.Id },
            new() { Name = "Parque Araucano", Category = "Parks", Description = "Santiago's modern urban park in Las Condes, with an outdoor amphitheatre.", Latitude = -33.3997, Longitude = -70.5797, CreatedBy = demo1.Id },
            new() { Name = "Nairobi Arboretum", Category = "Parks", Description = "Nairobi's green sanctuary with over 350 indigenous tree species.", Latitude = -1.2756, Longitude = 36.8060, CreatedBy = demo2.Id },

            // ── Offices (29) ──────────────────────────────────────────────────────
            new() { Name = "WeWork Moorgate", Category = "Offices", Description = "Premium co-working space in the City of London.", Latitude = 51.5193, Longitude = -0.0886, CreatedBy = demo2.Id },
            new() { Name = "Google NYC HQ", Category = "Offices", Description = "Google's main New York office at 111 Eighth Avenue.", Latitude = 40.7416, Longitude = -74.0010, CreatedBy = demo2.Id },
            new() { Name = "Roppongi Hills Mori Tower", Category = "Offices", Description = "Tokyo's landmark mixed-use skyscraper, 54 floors.", Latitude = 35.6604, Longitude = 139.7293, CreatedBy = demo1.Id },
            new() { Name = "Station F", Category = "Offices", Description = "World's largest startup campus, 13th arrondissement Paris.", Latitude = 48.8374, Longitude = 2.3682, CreatedBy = demo1.Id },
            new() { Name = "Factory Berlin Görlitzer Bahnhof", Category = "Offices", Description = "Historic venue turned tech campus in Kreuzberg.", Latitude = 52.4993, Longitude = 13.4342, CreatedBy = demo2.Id },
            new() { Name = "The Shard", Category = "Offices", Description = "Western Europe's tallest building with premium office floors.", Latitude = 51.5045, Longitude = -0.0865, CreatedBy = demo1.Id },
            new() { Name = "Canary Wharf", Category = "Offices", Description = "London's second financial district hosting global bank HQs.", Latitude = 51.5054, Longitude = -0.0235, CreatedBy = demo2.Id },
            new() { Name = "One World Trade Center", Category = "Offices", Description = "The tallest building in the Western Hemisphere, Lower Manhattan.", Latitude = 40.7127, Longitude = -74.0134, CreatedBy = demo1.Id },
            new() { Name = "Salesforce Tower", Category = "Offices", Description = "San Francisco's tallest skyscraper, headquarters of Salesforce.", Latitude = 37.7898, Longitude = -122.3972, CreatedBy = demo2.Id },
            new() { Name = "Meta HQ Menlo Park", Category = "Offices", Description = "Facebook's sprawling campus with Frank Gehry's MPK 20 building.", Latitude = 37.4845, Longitude = -122.1477, CreatedBy = demo1.Id },
            new() { Name = "Microsoft Redmond Campus", Category = "Offices", Description = "Microsoft's global headquarters spread across 500 acres in Redmond.", Latitude = 47.6423, Longitude = -122.1391, CreatedBy = demo2.Id },
            new() { Name = "DIFC Gate Building", Category = "Offices", Description = "Dubai International Financial Centre's iconic arch gateway building.", Latitude = 25.2121, Longitude = 55.2796, CreatedBy = demo1.Id },
            new() { Name = "Samsung Digital City", Category = "Offices", Description = "Samsung's R&D and innovation campus in Suwon, South Korea.", Latitude = 37.2636, Longitude = 127.0286, CreatedBy = demo2.Id },
            new() { Name = "Marina One Singapore", Category = "Offices", Description = "Singapore's award-winning green mixed-use development in the CBD.", Latitude = 1.2805, Longitude = 103.8469, CreatedBy = demo1.Id },
            new() { Name = "Here East", Category = "Offices", Description = "London's Olympic Park technology and creative campus in Stratford.", Latitude = 51.5434, Longitude = -0.0175, CreatedBy = demo2.Id },
            new() { Name = "Taipei 101 Office Tower", Category = "Offices", Description = "Taipei's bamboo-inspired supertall skyscraper and financial hub.", Latitude = 25.0336, Longitude = 121.5646, CreatedBy = demo1.Id },
            new() { Name = "WeWork São Paulo", Category = "Offices", Description = "Modern co-working hub in Faria Lima, São Paulo's finance district.", Latitude = -23.5614, Longitude = -46.6569, CreatedBy = demo2.Id },
            new() { Name = "Spaces Amsterdam Herengracht", Category = "Offices", Description = "Elegant co-working space in a 17th-century canal house.", Latitude = 52.3735, Longitude = 4.8956, CreatedBy = demo1.Id },
            new() { Name = "Manyata Tech Park", Category = "Offices", Description = "Bengaluru's premier IT park hosting over 80,000 professionals.", Latitude = 13.0475, Longitude = 77.6183, CreatedBy = demo2.Id },
            new() { Name = "MediaCity UK", Category = "Offices", Description = "Manchester's digital and creative hub, home to the BBC and ITV.", Latitude = 53.4746, Longitude = -2.2989, CreatedBy = demo1.Id },
            new() { Name = "Impact Hub Vienna", Category = "Offices", Description = "Vienna's global co-working and innovation network hub.", Latitude = 48.2082, Longitude = 16.3738, CreatedBy = demo2.Id },
            new() { Name = "Nairobi Garage", Category = "Offices", Description = "Nairobi's leading co-working space for Africa's tech entrepreneurs.", Latitude = -1.2921, Longitude = 36.8219, CreatedBy = demo1.Id },
            new() { Name = "KAFD Conference Centre", Category = "Offices", Description = "Riyadh's King Abdullah Financial District, Saudi Arabia's new CBD.", Latitude = 24.7658, Longitude = 46.6263, CreatedBy = demo2.Id },
            new() { Name = "Cyberjaya Technology Hub", Category = "Offices", Description = "Malaysia's Silicon Valley, host to global tech company R&D centres.", Latitude = 2.9202, Longitude = 101.6539, CreatedBy = demo1.Id },
            new() { Name = "H-Farm Campus", Category = "Offices", Description = "Europe's largest innovation campus in Venice's Treviso countryside.", Latitude = 45.6050, Longitude = 12.2610, CreatedBy = demo2.Id },
            new() { Name = "Pyrmont Bridge Road", Category = "Offices", Description = "Sydney's Ultimo technology precinct surrounding UTS.", Latitude = -33.8830, Longitude = 151.1963, CreatedBy = demo1.Id },
            new() { Name = "WeWork Ville Marie", Category = "Offices", Description = "Montreal co-working hub in the downtown Ville-Marie borough.", Latitude = 45.5017, Longitude = -73.5673, CreatedBy = demo2.Id },
            new() { Name = "Technopark Trivandrum", Category = "Offices", Description = "India's first technology park and one of Asia's largest IT campuses.", Latitude = 8.5667, Longitude = 76.8799, CreatedBy = demo1.Id },
            new() { Name = "Fintech Hub Stockholm", Category = "Offices", Description = "Stockholm's Stureplan district fintech cluster, the 'Nordic Silicon Valley'.", Latitude = 59.3348, Longitude = 18.0713, CreatedBy = demo2.Id },

            // ── Restaurants (29) ──────────────────────────────────────────────────
            new() { Name = "Dishoom Covent Garden", Category = "Restaurants", Description = "Iconic Bombay café-inspired restaurant, London.", Latitude = 51.5117, Longitude = -0.1240, CreatedBy = demo1.Id },
            new() { Name = "Le Bernardin", Category = "Restaurants", Description = "Three Michelin star French seafood, Midtown Manhattan.", Latitude = 40.7613, Longitude = -73.9818, CreatedBy = demo2.Id },
            new() { Name = "Sukiyabashi Jiro Honten", Category = "Restaurants", Description = "World-famous sushi in Tokyo's Ginza district.", Latitude = 35.6717, Longitude = 139.7641, CreatedBy = demo1.Id },
            new() { Name = "L'Ami Jean", Category = "Restaurants", Description = "Legendary Basque bistro in the 7th arrondissement.", Latitude = 48.8587, Longitude = 2.3066, CreatedBy = demo2.Id },
            new() { Name = "Nobelhart & Schmutzig", Category = "Restaurants", Description = "Berlin's brutally local cuisine on Friedrichstrasse.", Latitude = 52.5078, Longitude = 13.3892, CreatedBy = demo1.Id },
            new() { Name = "Hawker Chan", Category = "Restaurants", Description = "Singapore's Michelin-starred soy chicken rice.", Latitude = 1.2803, Longitude = 103.8440, CreatedBy = demo2.Id },
            new() { Name = "Noma", Category = "Restaurants", Description = "Copenhagen's legendary New Nordic restaurant by René Redzepi.", Latitude = 55.6833, Longitude = 12.5994, CreatedBy = demo1.Id },
            new() { Name = "Osteria Francescana", Category = "Restaurants", Description = "Massimo Bottura's three-Michelin-star temple in Modena.", Latitude = 44.6471, Longitude = 10.9252, CreatedBy = demo2.Id },
            new() { Name = "Central", Category = "Restaurants", Description = "Virgilio Martínez's altitude-driven tasting menu in Lima.", Latitude = -12.1228, Longitude = -77.0300, CreatedBy = demo1.Id },
            new() { Name = "Gaggan Anand", Category = "Restaurants", Description = "Bangkok's progressive Indian cuisine by chef Gaggan Anand.", Latitude = 13.7455, Longitude = 100.5271, CreatedBy = demo2.Id },
            new() { Name = "El Celler de Can Roca", Category = "Restaurants", Description = "The Roca brothers' three-star landmark in Girona, Spain.", Latitude = 41.9794, Longitude = 2.8214, CreatedBy = demo1.Id },
            new() { Name = "D.O.M.", Category = "Restaurants", Description = "Alex Atala's Amazonian-ingredient fine dining in São Paulo.", Latitude = -23.5671, Longitude = -46.6597, CreatedBy = demo2.Id },
            new() { Name = "The Test Kitchen", Category = "Restaurants", Description = "Luke Dale Roberts' boundary-pushing cuisine in Cape Town.", Latitude = -33.9249, Longitude = 18.4241, CreatedBy = demo1.Id },
            new() { Name = "Indian Accent", Category = "Restaurants", Description = "Delhi's most celebrated restaurant reinterpreting Indian heritage.", Latitude = 28.5931, Longitude = 77.2017, CreatedBy = demo2.Id },
            new() { Name = "Ultraviolet", Category = "Restaurants", Description = "Paul Pairet's 10-seat multi-sensory dining experience in Shanghai.", Latitude = 31.2304, Longitude = 121.4737, CreatedBy = demo1.Id },
            new() { Name = "8½ Otto e Mezzo Bombana", Category = "Restaurants", Description = "Hong Kong's only three-Michelin-star Italian restaurant in Central.", Latitude = 22.2814, Longitude = 114.1572, CreatedBy = demo2.Id },
            new() { Name = "Quintonil", Category = "Restaurants", Description = "Jorge Vallejo's modern Mexican cuisine in Polanco, Mexico City.", Latitude = 19.4284, Longitude = -99.1934, CreatedBy = demo1.Id },
            new() { Name = "Saison", Category = "Restaurants", Description = "San Francisco wood-fire cooking focused on seasonal Californian produce.", Latitude = 37.7849, Longitude = -122.4034, CreatedBy = demo2.Id },
            new() { Name = "Alinea", Category = "Restaurants", Description = "Grant Achatz's avant-garde molecular dining in Chicago's Lincoln Park.", Latitude = 41.9227, Longitude = -87.6481, CreatedBy = demo1.Id },
            new() { Name = "Boragó", Category = "Restaurants", Description = "Rodolfo Guzmán's hyper-local Andean cuisine in Santiago.", Latitude = -33.4099, Longitude = -70.5878, CreatedBy = demo2.Id },
            new() { Name = "Nour", Category = "Restaurants", Description = "Sydney's acclaimed Middle Eastern share-plate dining in Surry Hills.", Latitude = -33.8838, Longitude = 151.2091, CreatedBy = demo1.Id },
            new() { Name = "Maaemo", Category = "Restaurants", Description = "Oslo's three-Michelin-star tribute to Norwegian nature and seasons.", Latitude = 59.9150, Longitude = 10.7650, CreatedBy = demo2.Id },
            new() { Name = "Geranium", Category = "Restaurants", Description = "Copenhagen's highest restaurant, perched atop the national football stadium.", Latitude = 55.6978, Longitude = 12.5755, CreatedBy = demo1.Id },
            new() { Name = "Hajime", Category = "Restaurants", Description = "Osaka's single-Michelin French-Japanese fusion by Hajime Yoneda.", Latitude = 34.7024, Longitude = 135.4937, CreatedBy = demo2.Id },
            new() { Name = "Arzak", Category = "Restaurants", Description = "Juan Mari Arzak's flagship Basque kitchen in San Sebastián.", Latitude = 43.3138, Longitude = -1.9795, CreatedBy = demo1.Id },
            new() { Name = "Caprice", Category = "Restaurants", Description = "Hong Kong's Four Seasons French fine dining overlooking Victoria Harbour.", Latitude = 22.2867, Longitude = 114.1577, CreatedBy = demo2.Id },
            new() { Name = "Willows Inn", Category = "Restaurants", Description = "Lummi Island farm-to-table experience with Pacific Northwest seafood.", Latitude = 48.7031, Longitude = -122.7048, CreatedBy = demo1.Id },
            new() { Name = "Lasai", Category = "Restaurants", Description = "Rafa Costa e Silva's hyper-seasonal fine dining in Rio de Janeiro.", Latitude = -22.9671, Longitude = -43.1965, CreatedBy = demo2.Id },
            new() { Name = "Sorn", Category = "Restaurants", Description = "Bangkok's two-Michelin-star Southern Thai cuisine in Ekkamai.", Latitude = 13.7200, Longitude = 100.5850, CreatedBy = demo1.Id },

            // ── Hotels (29) ───────────────────────────────────────────────────────
            new() { Name = "The Savoy", Category = "Hotels", Description = "London's most iconic luxury hotel on the Strand.", Latitude = 51.5104, Longitude = -0.1201, CreatedBy = demo2.Id },
            new() { Name = "The Standard High Line", Category = "Hotels", Description = "Ultra-stylish hotel straddling the High Line, NYC.", Latitude = 40.7479, Longitude = -74.0046, CreatedBy = demo1.Id },
            new() { Name = "Aman Tokyo", Category = "Hotels", Description = "Sanctuary in the sky at the top of Otemachi Tower.", Latitude = 35.6868, Longitude = 139.7648, CreatedBy = demo1.Id },
            new() { Name = "Hôtel Plaza Athénée", Category = "Hotels", Description = "Fashion district palace hotel on Avenue Montaigne.", Latitude = 48.8665, Longitude = 2.3034, CreatedBy = demo2.Id },
            new() { Name = "Hotel de Rome", Category = "Hotels", Description = "Historic former bank on Bebelplatz, Berlin.", Latitude = 52.5172, Longitude = 13.3928, CreatedBy = demo1.Id },
            new() { Name = "Burj Al Arab", Category = "Hotels", Description = "Dubai's iconic sail-shaped seven-star hotel on its own island.", Latitude = 25.1412, Longitude = 55.1853, CreatedBy = demo2.Id },
            new() { Name = "Park Hyatt Sydney", Category = "Hotels", Description = "Sydney harbour-front luxury hotel with views of the Opera House.", Latitude = -33.8600, Longitude = 151.2130, CreatedBy = demo1.Id },
            new() { Name = "The Oberoi Mumbai", Category = "Hotels", Description = "Nariman Point landmark hotel overlooking the Arabian Sea.", Latitude = 18.9220, Longitude = 72.8231, CreatedBy = demo2.Id },
            new() { Name = "The Peninsula Hong Kong", Category = "Hotels", Description = "The Grande Dame of the Far East in Tsim Sha Tsui since 1928.", Latitude = 22.2950, Longitude = 114.1722, CreatedBy = demo1.Id },
            new() { Name = "Mandarin Oriental Bangkok", Category = "Hotels", Description = "Bangkok's legendary Chao Phraya riverside hotel since 1876.", Latitude = 13.7257, Longitude = 100.5127, CreatedBy = demo2.Id },
            new() { Name = "Raffles Hotel Singapore", Category = "Hotels", Description = "Singapore's colonial landmark and birthplace of the Singapore Sling.", Latitude = 1.2948, Longitude = 103.8536, CreatedBy = demo1.Id },
            new() { Name = "Four Seasons Toronto", Category = "Hotels", Description = "Toronto's premier luxury hotel in Yorkville's cultural district.", Latitude = 43.6723, Longitude = -79.3871, CreatedBy = demo2.Id },
            new() { Name = "Fairmont Banff Springs", Category = "Hotels", Description = "Canada's Castle in the Rockies surrounded by UNESCO wilderness.", Latitude = 51.1644, Longitude = -115.5705, CreatedBy = demo1.Id },
            new() { Name = "The Ritz London", Category = "Hotels", Description = "Mayfair's legendary hotel synonymous with British grandeur since 1906.", Latitude = 51.5072, Longitude = -0.1413, CreatedBy = demo2.Id },
            new() { Name = "Hotel Arts Barcelona", Category = "Hotels", Description = "Modernist beachfront tower hotel in Barcelona's Vila Olímpica.", Latitude = 41.3868, Longitude = 2.1960, CreatedBy = demo1.Id },
            new() { Name = "Hotel Sacher Vienna", Category = "Hotels", Description = "Vienna's grand fin-de-siècle hotel, home of the original Sachertorte.", Latitude = 48.2027, Longitude = 16.3689, CreatedBy = demo2.Id },
            new() { Name = "Conservatorium Hotel Amsterdam", Category = "Hotels", Description = "A 19th-century bank vault transformed into Amsterdam's finest hotel.", Latitude = 52.3616, Longitude = 4.8840, CreatedBy = demo1.Id },
            new() { Name = "Copacabana Palace", Category = "Hotels", Description = "Rio de Janeiro's iconic white-fronted palace on Copacabana beach.", Latitude = -22.9671, Longitude = -43.1778, CreatedBy = demo2.Id },
            new() { Name = "Fasano São Paulo", Category = "Hotels", Description = "São Paulo's art deco luxury boutique hotel in Jardins neighbourhood.", Latitude = -23.5688, Longitude = -46.6631, CreatedBy = demo1.Id },
            new() { Name = "The Leela Palace Delhi", Category = "Hotels", Description = "Delhi's regal luxury hotel inspired by the grandeur of Lutyens' city.", Latitude = 28.5958, Longitude = 77.2109, CreatedBy = demo2.Id },
            new() { Name = "Lotte Hotel Seoul", Category = "Hotels", Description = "Seoul's landmark luxury hotel in Jung-gu with panoramic city views.", Latitude = 37.5650, Longitude = 126.9794, CreatedBy = demo1.Id },
            new() { Name = "Capella Shanghai", Category = "Hotels", Description = "Art deco heritage hotel on the Bund in a restored 1916 building.", Latitude = 31.2423, Longitude = 121.4913, CreatedBy = demo2.Id },
            new() { Name = "Amanjiwo", Category = "Hotels", Description = "Sublime retreat overlooking the Borobudur temple complex in Java.", Latitude = -7.5979, Longitude = 110.2044, CreatedBy = demo1.Id },
            new() { Name = "Awasi Atacama", Category = "Hotels", Description = "Remote desert lodge in Chile's Atacama, with personal guides and 4WDs.", Latitude = -22.9077, Longitude = -68.1993, CreatedBy = demo2.Id },
            new() { Name = "The Singular Santiago", Category = "Hotels", Description = "Santiago's coolest design hotel in a converted 1920s factory.", Latitude = -33.4372, Longitude = -70.6399, CreatedBy = demo1.Id },
            new() { Name = "Gritti Palace Venice", Category = "Hotels", Description = "A 15th-century palace on the Grand Canal, Venice's most romantic hotel.", Latitude = 45.4328, Longitude = 12.3337, CreatedBy = demo2.Id },
            new() { Name = "Hotel de Russie Rome", Category = "Hotels", Description = "Rome's Via Veneto-era hideaway with a legendary secret garden.", Latitude = 41.9063, Longitude = 12.4782, CreatedBy = demo1.Id },
            new() { Name = "Qasr Al Sarab Desert Resort", Category = "Hotels", Description = "Abu Dhabi's mirage-like desert fortress resort in the Empty Quarter.", Latitude = 23.3031, Longitude = 53.9701, CreatedBy = demo2.Id },
            new() { Name = "One&Only Cape Town", Category = "Hotels", Description = "Cape Town's waterfront luxury island resort at the V&A.", Latitude = -33.9042, Longitude = 18.4199, CreatedBy = demo1.Id },

            // ── Landmarks (29) ────────────────────────────────────────────────────
            new() { Name = "Tower Bridge", Category = "Landmarks", Description = "Victorian Gothic bascule bridge, London's most famous landmark.", Latitude = 51.5055, Longitude = -0.0754, CreatedBy = demo1.Id },
            new() { Name = "Statue of Liberty", Category = "Landmarks", Description = "Symbol of freedom on Liberty Island, New York Harbor.", Latitude = 40.6892, Longitude = -74.0445, CreatedBy = demo2.Id },
            new() { Name = "Tokyo Skytree", Category = "Landmarks", Description = "World's second tallest structure at 634 metres.", Latitude = 35.7101, Longitude = 139.8107, CreatedBy = demo1.Id },
            new() { Name = "Eiffel Tower", Category = "Landmarks", Description = "Gustave Eiffel's 1889 iron lattice masterpiece.", Latitude = 48.8584, Longitude = 2.2945, CreatedBy = demo2.Id },
            new() { Name = "Brandenburg Gate", Category = "Landmarks", Description = "Neoclassical monument, symbol of German reunification.", Latitude = 52.5163, Longitude = 13.3777, CreatedBy = demo1.Id },
            new() { Name = "Marina Bay Sands", Category = "Landmarks", Description = "Iconic integrated resort with infinity pool, Singapore.", Latitude = 1.2834, Longitude = 103.8607, CreatedBy = demo2.Id },
            new() { Name = "Sydney Opera House", Category = "Landmarks", Description = "Jørn Utzon's UNESCO-listed expressionist masterpiece on Bennelong Point.", Latitude = -33.8568, Longitude = 151.2153, CreatedBy = demo1.Id },
            new() { Name = "Colosseum", Category = "Landmarks", Description = "Rome's 2,000-year-old amphitheatre, the largest ever built.", Latitude = 41.8902, Longitude = 12.4922, CreatedBy = demo2.Id },
            new() { Name = "Sagrada Família", Category = "Landmarks", Description = "Gaudí's unfinished UNESCO basilica, Barcelona's spiritual centrepiece.", Latitude = 41.4036, Longitude = 2.1744, CreatedBy = demo1.Id },
            new() { Name = "Acropolis of Athens", Category = "Landmarks", Description = "Ancient citadel with the Parthenon, overlooking modern Athens.", Latitude = 37.9715, Longitude = 23.7257, CreatedBy = demo2.Id },
            new() { Name = "Burj Khalifa", Category = "Landmarks", Description = "World's tallest building at 828m in the heart of Dubai.", Latitude = 25.1972, Longitude = 55.2744, CreatedBy = demo1.Id },
            new() { Name = "Taj Mahal", Category = "Landmarks", Description = "Shah Jahan's ivory-white marble mausoleum in Agra, India.", Latitude = 27.1751, Longitude = 78.0421, CreatedBy = demo2.Id },
            new() { Name = "Great Wall of China Mutianyu", Category = "Landmarks", Description = "Best-preserved section of the Great Wall, north of Beijing.", Latitude = 40.4319, Longitude = 116.5704, CreatedBy = demo1.Id },
            new() { Name = "Christ the Redeemer", Category = "Landmarks", Description = "Rio's 30-metre art deco statue atop Corcovado mountain.", Latitude = -22.9519, Longitude = -43.2105, CreatedBy = demo2.Id },
            new() { Name = "Machu Picchu", Category = "Landmarks", Description = "Inca citadel set high in the Andes of Peru, a UNESCO World Heritage Site.", Latitude = -13.1631, Longitude = -72.5450, CreatedBy = demo1.Id },
            new() { Name = "Angkor Wat", Category = "Landmarks", Description = "The world's largest religious monument in Siem Reap, Cambodia.", Latitude = 13.4125, Longitude = 103.8660, CreatedBy = demo2.Id },
            new() { Name = "Hagia Sophia", Category = "Landmarks", Description = "Istanbul's Byzantine cathedral-turned-mosque, a UNESCO landmark.", Latitude = 41.0086, Longitude = 28.9802, CreatedBy = demo1.Id },
            new() { Name = "CN Tower", Category = "Landmarks", Description = "Toronto's iconic 553m communications tower with a glass floor.", Latitude = 43.6426, Longitude = -79.3871, CreatedBy = demo2.Id },
            new() { Name = "Petronas Twin Towers", Category = "Landmarks", Description = "Kuala Lumpur's twin supertall skyscrapers, connected by a sky bridge.", Latitude = 3.1579, Longitude = 101.7116, CreatedBy = demo1.Id },
            new() { Name = "Atomium Brussels", Category = "Landmarks", Description = "Belgium's iron crystal structure built for the 1958 World Expo.", Latitude = 50.8949, Longitude = 4.3417, CreatedBy = demo2.Id },
            new() { Name = "Alhambra", Category = "Landmarks", Description = "Moorish palace and fortress complex overlooking Granada, Spain.", Latitude = 37.1773, Longitude = -3.5986, CreatedBy = demo1.Id },
            new() { Name = "Golden Gate Bridge", Category = "Landmarks", Description = "San Francisco's Art Deco suspension bridge spanning the Golden Gate.", Latitude = 37.8199, Longitude = -122.4783, CreatedBy = demo2.Id },
            new() { Name = "Table Mountain", Category = "Landmarks", Description = "Cape Town's flat-topped mountain accessible by aerial cableway.", Latitude = -33.9628, Longitude = 18.4041, CreatedBy = demo1.Id },
            new() { Name = "Victoria Falls", Category = "Landmarks", Description = "The world's largest waterfall on the Zambia-Zimbabwe border.", Latitude = -17.9243, Longitude = 25.8572, CreatedBy = demo2.Id },
            new() { Name = "St. Basil's Cathedral", Category = "Landmarks", Description = "Moscow's colourful onion-domed cathedral on Red Square.", Latitude = 55.7525, Longitude = 37.6231, CreatedBy = demo1.Id },
            new() { Name = "Prague Castle", Category = "Landmarks", Description = "The world's largest ancient castle complex, dominating Prague's skyline.", Latitude = 50.0921, Longitude = 14.4000, CreatedBy = demo2.Id },
            new() { Name = "Neuschwanstein Castle", Category = "Landmarks", Description = "Bavaria's fairy-tale hilltop castle that inspired Disney's Cinderella castle.", Latitude = 47.5576, Longitude = 10.7498, CreatedBy = demo1.Id },
            new() { Name = "Schönbrunn Palace", Category = "Landmarks", Description = "Vienna's Habsburg imperial summer residence with baroque gardens.", Latitude = 48.1845, Longitude = 16.3122, CreatedBy = demo2.Id },
            new() { Name = "Space Needle", Category = "Landmarks", Description = "Seattle's 1962 World's Fair futuristic observation tower.", Latitude = 47.6205, Longitude = -122.3493, CreatedBy = demo1.Id },

            // ── Transit (27) ──────────────────────────────────────────────────────
            new() { Name = "King's Cross St. Pancras", Category = "Transit", Description = "London's international rail gateway, terminus for Eurostar and HS1.", Latitude = 51.5309, Longitude = -0.1233, CreatedBy = demo1.Id },
            new() { Name = "Grand Central Terminal", Category = "Transit", Description = "New York's Beaux-Arts masterpiece, the world's most visited train station.", Latitude = 40.7527, Longitude = -73.9772, CreatedBy = demo2.Id },
            new() { Name = "Shinjuku Station", Category = "Transit", Description = "The world's busiest railway station with over 200 exits.", Latitude = 35.6896, Longitude = 139.7006, CreatedBy = demo1.Id },
            new() { Name = "Gare du Nord", Category = "Transit", Description = "Paris's gateway to Northern Europe and the busiest station in the world.", Latitude = 48.8809, Longitude = 2.3553, CreatedBy = demo2.Id },
            new() { Name = "Berlin Hauptbahnhof", Category = "Transit", Description = "Europe's largest multi-level train station in the heart of Berlin.", Latitude = 52.5250, Longitude = 13.3690, CreatedBy = demo1.Id },
            new() { Name = "Singapore Changi Airport", Category = "Transit", Description = "Consistently rated the world's best airport, home of the Jewel.", Latitude = 1.3644, Longitude = 103.9915, CreatedBy = demo2.Id },
            new() { Name = "Dubai International Airport", Category = "Transit", Description = "The world's busiest airport for international passengers.", Latitude = 25.2528, Longitude = 55.3644, CreatedBy = demo1.Id },
            new() { Name = "Heathrow Terminal 5", Category = "Transit", Description = "London Heathrow's flagship British Airways terminal by Richard Rogers.", Latitude = 51.4775, Longitude = -0.4614, CreatedBy = demo2.Id },
            new() { Name = "JFK International Airport", Category = "Transit", Description = "New York's primary international gateway in Queens.", Latitude = 40.6413, Longitude = -73.7781, CreatedBy = demo1.Id },
            new() { Name = "Narita International Airport", Category = "Transit", Description = "Tokyo's main international hub serving 40 million passengers annually.", Latitude = 35.7720, Longitude = 140.3929, CreatedBy = demo2.Id },
            new() { Name = "Charles de Gaulle Airport", Category = "Transit", Description = "Paris's main airport and France's largest aviation hub.", Latitude = 49.0097, Longitude = 2.5479, CreatedBy = demo1.Id },
            new() { Name = "Amsterdam Centraal", Category = "Transit", Description = "Amsterdam's neo-Gothic central station serving 250,000 passengers daily.", Latitude = 52.3791, Longitude = 4.8999, CreatedBy = demo2.Id },
            new() { Name = "Incheon International Airport", Category = "Transit", Description = "Seoul's primary airport, repeatedly rated among the world's best.", Latitude = 37.4602, Longitude = 126.4407, CreatedBy = demo1.Id },
            new() { Name = "Hong Kong International Airport", Category = "Transit", Description = "Chek Lap Kok airport on Lantau Island, Asia's major aviation hub.", Latitude = 22.3080, Longitude = 113.9185, CreatedBy = demo2.Id },
            new() { Name = "Zurich Hauptbahnhof", Category = "Transit", Description = "Switzerland's largest railway station and Europe's most punctual.", Latitude = 47.3782, Longitude = 8.5403, CreatedBy = demo1.Id },
            new() { Name = "Vienna Hauptbahnhof", Category = "Transit", Description = "Vienna's modern central station, opened 2015, with 1,000 trains daily.", Latitude = 48.1851, Longitude = 16.3762, CreatedBy = demo2.Id },
            new() { Name = "Istanbul Airport", Category = "Transit", Description = "One of the world's largest airports, capacity for 200 million passengers.", Latitude = 41.2753, Longitude = 28.7519, CreatedBy = demo1.Id },
            new() { Name = "O'Hare International Airport", Category = "Transit", Description = "Chicago's main gateway and one of the world's busiest airports.", Latitude = 41.9742, Longitude = -87.9073, CreatedBy = demo2.Id },
            new() { Name = "Los Angeles International Airport", Category = "Transit", Description = "LAX, the primary airport for the US West Coast.", Latitude = 33.9425, Longitude = -118.4081, CreatedBy = demo1.Id },
            new() { Name = "Frankfurt Airport", Category = "Transit", Description = "Germany's largest airport and Europe's third busiest hub.", Latitude = 50.0379, Longitude = 8.5622, CreatedBy = demo2.Id },
            new() { Name = "Adolfo Suárez Madrid–Barajas", Category = "Transit", Description = "Madrid's international airport, gateway to Latin America.", Latitude = 40.4983, Longitude = -3.5676, CreatedBy = demo1.Id },
            new() { Name = "Mumbai Chhatrapati Shivaji Terminus", Category = "Transit", Description = "Mumbai's UNESCO-listed Victorian Gothic railway terminus.", Latitude = 18.9398, Longitude = 72.8355, CreatedBy = demo2.Id },
            new() { Name = "KL Sentral", Category = "Transit", Description = "Kuala Lumpur's integrated transport hub connecting rail, metro and airport.", Latitude = 3.1339, Longitude = 101.6869, CreatedBy = demo1.Id },
            new() { Name = "São Paulo Guarulhos Airport", Category = "Transit", Description = "Brazil's busiest international airport serving 44 million passengers.", Latitude = -23.4356, Longitude = -46.4731, CreatedBy = demo2.Id },
            new() { Name = "Toronto Pearson International", Category = "Transit", Description = "Canada's largest airport, connecting 180 destinations worldwide.", Latitude = 43.6777, Longitude = -79.6248, CreatedBy = demo1.Id },
            new() { Name = "Sydney Kingsford Smith Airport", Category = "Transit", Description = "Australia's busiest airport, operating since 1920.", Latitude = -33.9399, Longitude = 151.1753, CreatedBy = demo2.Id },
            new() { Name = "Cape Town International Airport", Category = "Transit", Description = "South Africa's second busiest airport, gateway to the Cape.", Latitude = -33.9648, Longitude = 18.5969, CreatedBy = demo1.Id },
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
