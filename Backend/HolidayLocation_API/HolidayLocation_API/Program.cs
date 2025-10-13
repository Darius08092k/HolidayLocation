
using HolidayLocation_API.Data;
using HolidayLocation_API.Repositories.IRepository;
using HolidayLocation_API.Repositories.Repository;
using Microsoft.EntityFrameworkCore;

namespace HolidayLocation_API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);



/*            //builder.Services.AddDbContext<AppDbContext>(options => 
                    //options.UseInMemoryDatabase("HolidayLocationInMemDB"));*/

            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("HolidayLocationSQLConnection")));

            // Add services to the container.

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("PropetiesCORS",
                    policy => policy
                        .SetIsOriginAllowed(origin => true)
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials());
            });

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddScoped<IPropertyRepository, PropertyRepository>();
            builder.Services.AddScoped<IBookingRepository, BookingRepository>();


            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseCors("PropetiesCORS");

            // Enable static file serving for images
            app.UseStaticFiles();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
