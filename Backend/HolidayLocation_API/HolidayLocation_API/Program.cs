
using HolidayLocation_API.Data;
using HolidayLocation_API.Models;
using HolidayLocation_API.Repositories.IRepository;
using HolidayLocation_API.Repositories.Repository;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace HolidayLocation_API
{
    public class Program
    {
        public static async Task Main(string[] args)
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

            // Add Identity + roles
            builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            {
                options.User.RequireUniqueEmail = true;
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequiredLength = 6;

            })
                .AddEntityFrameworkStores<AppDbContext>()
                .AddDefaultTokenProviders();

            // Configure application cookie
            builder.Services.ConfigureApplicationCookie(options =>
            {
                options.Cookie.Name = "HolidayAuth";
                options.Cookie.HttpOnly = false;
                options.Cookie.SameSite = SameSiteMode.None; // for cross-site SPA requests
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // requires HTTPS
                options.LoginPath = "/api/Auth/login";
                options.LogoutPath = "/api/Auth/logout";
            });

            builder.Services.AddDataProtection();


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

            app.UseCors("PropetiesCORS");

            // Enable static file serving for images
            app.UseStaticFiles();

            app.UseAuthentication();

            app.UseAuthorization();

           

            app.MapControllers();

            app.Run();
        }
    }
}
