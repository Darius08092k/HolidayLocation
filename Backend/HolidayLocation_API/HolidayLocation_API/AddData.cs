using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HolidayLocation_API
{
    public class AddData
    {
        modelBuilder.Entity<Property>().HasData(
                new Property
                {
                    Id = 1,
                    Name = "Seaside Villa",
                    Details = "Beautiful oceanfront property with stunning views and private beach access",
                    Rate = 350.00,
                    Occupancy = 6,
                    Sqft = 2500,
                    ImageUrl = "/Images/Villa1/villa1-main.jpg",
                    Amenity = "Pool, Beach Access, WiFi, Kitchen, Parking",
                    CreatedDate = new DateTime(2024, 1, 15)
                },
                new Property
                {
                    Id = 2,
                    Name = "Mountain Retreat",
                    Details = "Cozy cabin nestled in the mountains with hiking trails nearby",
                    Rate = 225.00,
                    Occupancy = 4,
                    Sqft = 1800,
                    ImageUrl = "/Images/Villa1/villa1-main.jpg",
                    Amenity = "Fireplace, Hiking, WiFi, Kitchen, Hot Tub",
                    CreatedDate = new DateTime(2024, 2, 10)
                },
                new Property
                {
                    Id = 3,
                    Name = "City Loft",
                    Details = "Modern downtown loft with city skyline views and rooftop access",
                    Rate = 180.00,
                    Occupancy = 2,
                    Sqft = 1200,
                    ImageUrl = "/Images/Villa1/villa1-main.jpg",
                    Amenity = "WiFi, Gym Access, Rooftop Terrace, Kitchen",
                    CreatedDate = new DateTime(2024, 3, 5)
                },
                new Property
                {
                    Id = 4,
                    Name = "Luxury Estate",
                    Details = "Expansive property with premium amenities and spacious layout",
                    Rate = 450.00,
                    Occupancy = 8,
                    Sqft = 3500,
                    ImageUrl = "/Images/Villa1/villa1-main.jpg",
                    Amenity = "Pool, Spa, WiFi, Kitchen, Parking, Garden",
                    CreatedDate = new DateTime(2024, 1, 20)
                },
                new Property
                {
                    Id = 5,
                    Name = "Countryside Cottage",
                    Details = "Peaceful rural setting with traditional charm and modern comfort",
                    Rate = 175.00,
                    Occupancy = 4,
                    Sqft = 1600,
                    ImageUrl = "/Images/Villa1/villa1-main.jpg",
                    Amenity = "Fireplace, Garden, WiFi, Kitchen",
                    CreatedDate = new DateTime(2024, 2, 15)
                }
            );
        }
    }
    }
}