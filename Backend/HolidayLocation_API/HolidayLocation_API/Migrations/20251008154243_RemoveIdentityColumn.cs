using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HolidayLocation_API.Migrations
{
    /// <inheritdoc />
    public partial class RemoveIdentityColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Backup data
            migrationBuilder.Sql(@"
                SELECT * INTO Property_Backup FROM Property
            ");

            // Drop original table
            migrationBuilder.Sql(@"
                DROP TABLE Property
            ");

            // Recreate table without IDENTITY
            migrationBuilder.Sql(@"
                CREATE TABLE Property (
                    Id int NOT NULL PRIMARY KEY,
                    Name nvarchar(max) NULL,
                    Details nvarchar(max) NULL,
                    Rate float NOT NULL,
                    Occupancy int NOT NULL,
                    Sqft int NOT NULL,
                    ImageUrl nvarchar(max) NULL,
                    Amenity nvarchar(max) NULL,
                    CreatedDate datetime2 NOT NULL
                )
            ");

            // Restore data
            migrationBuilder.Sql(@"
                IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Property_Backup')
                BEGIN
                    INSERT INTO Property (Id, Name, Details, Rate, Occupancy, Sqft, ImageUrl, Amenity, CreatedDate)
                    SELECT Id, Name, Details, Rate, Occupancy, Sqft, ImageUrl, Amenity, CreatedDate
                    FROM Property_Backup
                    
                    DROP TABLE Property_Backup
                END
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Backup data
            migrationBuilder.Sql(@"
                SELECT * INTO Property_Backup FROM Property
            ");

            // Drop table
            migrationBuilder.Sql(@"
                DROP TABLE Property
            ");

            // Recreate with IDENTITY
            migrationBuilder.Sql(@"
                CREATE TABLE Property (
                    Id int NOT NULL IDENTITY(1,1) PRIMARY KEY,
                    Name nvarchar(max) NULL,
                    Details nvarchar(max) NULL,
                    Rate float NOT NULL,
                    Occupancy int NOT NULL,
                    Sqft int NOT NULL,
                    ImageUrl nvarchar(max) NULL,
                    Amenity nvarchar(max) NULL,
                    CreatedDate datetime2 NOT NULL
                )
            ");

            // Restore data with IDENTITY_INSERT
            migrationBuilder.Sql(@"
                IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Property_Backup')
                BEGIN
                    SET IDENTITY_INSERT Property ON
                    
                    INSERT INTO Property (Id, Name, Details, Rate, Occupancy, Sqft, ImageUrl, Amenity, CreatedDate)
                    SELECT Id, Name, Details, Rate, Occupancy, Sqft, ImageUrl, Amenity, CreatedDate
                    FROM Property_Backup
                    
                    SET IDENTITY_INSERT Property OFF
                    
                    DROP TABLE Property_Backup
                END
            ");
        }
    }
}