using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HolidayLocation_API.Migrations
{
    /// <inheritdoc />
    public partial class SeedDataIntoDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Property",
                columns: new[] { "Id", "Amenity", "CreatedDate", "Details", "ImageUrl", "Name", "Occupancy", "Rate", "Sqft" },
                values: new object[,]
                {
                    { 1, "Pool, Beach Access, WiFi, Kitchen, Parking", new DateTime(2024, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Beautiful oceanfront property with stunning views and private beach access", "/Images/Villa1/villa1-main.jpg", "Seaside Villa", 6, 350.0, 2500 },
                    { 2, "Fireplace, Hiking, WiFi, Kitchen, Hot Tub", new DateTime(2024, 2, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Cozy cabin nestled in the mountains with hiking trails nearby", "/Images/Villa1/villa1-main.jpg", "Mountain Retreat", 4, 225.0, 1800 },
                    { 3, "WiFi, Gym Access, Rooftop Terrace, Kitchen", new DateTime(2024, 3, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Modern downtown loft with city skyline views and rooftop access", "/Images/Villa1/villa1-main.jpg", "City Loft", 2, 180.0, 1200 },
                    { 4, "Pool, Spa, WiFi, Kitchen, Parking, Garden", new DateTime(2024, 1, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Expansive property with premium amenities and spacious layout", "/Images/Villa1/villa1-main.jpg", "Luxury Estate", 8, 450.0, 3500 },
                    { 5, "Fireplace, Garden, WiFi, Kitchen", new DateTime(2024, 2, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Peaceful rural setting with traditional charm and modern comfort", "/Images/Villa1/villa1-main.jpg", "Countryside Cottage", 4, 175.0, 1600 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Property",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Property",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Property",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Property",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Property",
                keyColumn: "Id",
                keyValue: 5);
        }
    }
}
