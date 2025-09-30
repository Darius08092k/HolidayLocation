using HolidayLocation_API.Models;
using Microsoft.EntityFrameworkCore;

namespace HolidayLocation_API.Data
{
    public class AppDbContext : DbContext   
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }
        public DbSet<Property> Property { get; set; }
    }
}
