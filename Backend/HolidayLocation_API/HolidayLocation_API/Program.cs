
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



/*            builder.Services.AddDbContext<AppDbContext>(options => 
                    options.UseInMemoryDatabase("HolidayLocationInMemDB"));*/

            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("HolidayLocationSQLConnection")));

            // Add services to the container.

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("PropetiesCORS",
                    policy => policy
                        .WithOrigins(
                            "http://localhost:4200",
                            "http://192.168.1.138:4200")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
            });

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddScoped<IPropertyRepository, PropertyRepository>();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.UseCors("PropetiesCORS");

            app.MapControllers();

            app.Run();
        }
    }
}
