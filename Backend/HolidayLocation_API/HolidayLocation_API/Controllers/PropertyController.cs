﻿﻿﻿using HolidayLocation_API.Models;
using HolidayLocation_API.Repositories.IRepository;
using HolidayLocation_API.Repositories.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HolidayLocation_API.Controllers
{
    [Route("api/PropertyAPI")]
    [ApiController]
    public class PropertyController : ControllerBase
    {
        private readonly IPropertyRepository _dbVilla;

        public PropertyController(IPropertyRepository propertyRepository)
        {
            _dbVilla = propertyRepository;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]

        public async Task<ActionResult<Property>> CreateProperty(Property property)
        {
            // Get next property ID
            var nextId = await _dbVilla.GetNextAvailableIdAsync();
            property.Id = nextId;

            
            await _dbVilla.CreateAsync(property);
            return Ok(property);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProperties()
        {
            var villaList = await _dbVilla.GetAllAsync();
            return Ok(villaList);
        }

        [HttpGet("{id:int}", Name = "GetProperty")] 
        public async Task<IActionResult> GetProperty(int id)
        {
            var villa = await _dbVilla.GetByIdAsync(id);
            if (villa == null)
            {
                return NotFound();
            }
            return Ok(villa);
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]

        public async Task<IActionResult> DeleteProperty(int id)
        {
            var villa = await _dbVilla.GetByIdAsync(id);
            if (villa == null)
            {
                return NotFound();
            }
            await _dbVilla.DeleteAsync(id);
            return NoContent();
        }

        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateProperty(int id, Property property)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid property ID");
            }
  
            if (property == null)
            {
                return BadRequest("Property data is required");
            }

            // Check if property exists without tracking
            var exists = await _dbVilla.PropertyExistsAsync(id);
            if (!exists)
            {
                return NotFound($"Property with ID {id} not found");
            }

            // Set the ID to ensure we're updating the correct entity
            property.Id = id;

            var updatedProperty = await _dbVilla.UpdatePropertyAsync(property);
            return Ok(updatedProperty);
        }

        [HttpDelete("all")]
        [Authorize(Roles = "Admin")]

        public async Task<IActionResult> DeleteAllProperty()
        {
            await _dbVilla.DeleteAllAsync();
            return NoContent();
        }

        [HttpPost("seed-image-urls")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SeedImageUrls()
        {
            // Get all properties
            var properties = await _dbVilla.GetAllAsync();

            // Update specific properties with image URLs
            var updates = new Dictionary<int, string>
            {
                { 1, "/images/Villa1/villa1-main.jpg" },
                { 2, "/images/Villa2/villa2-main.jpg" },
                { 3, "/images/Villa3/villa3-main.jpg" },
                { 4, "/images/Villa4/villa4-main.jpg" },
                { 5, "/images/Villa5/villa5-main.jpg" }
            };

            foreach (var property in properties)
            {
                if (updates.ContainsKey(property.Id))
                {
                    property.ImageUrl = updates[property.Id];
                    await _dbVilla.UpdatePropertyAsync(property);
                }
            }

            return Ok(new { message = "Image URLs updated successfully", updatedCount = updates.Count });
        }

        [HttpGet("images")]
        public IActionResult GetAvailableImages()
        {
            try
            {
                var imagesPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
                
                if (!Directory.Exists(imagesPath))
                {
                    return Ok(new { folders = new List<object>() });
                }

                var folders = Directory.GetDirectories(imagesPath)
                    .Select(folder => new
                    {
                        name = Path.GetFileName(folder),
                        images = Directory.GetFiles(folder)
                            .Where(file => IsImageFile(file))
                            .Select(file => new
                            {
                                filename = Path.GetFileName(file),
                                path = $"/images/{Path.GetFileName(folder)}/{Path.GetFileName(file)}"
                            })
                            .ToList()
                    })
                    .Where(f => ((List<dynamic>)f.images).Count > 0)
                    .ToList();

                return Ok(new { folders = folders });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        private bool IsImageFile(string filePath)
        {
            var imageExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            return imageExtensions.Contains(Path.GetExtension(filePath).ToLower());
        }

        [HttpPost("open-file-browser")]
        [Authorize(Roles = "Admin")]
        public IActionResult OpenFileBrowser()
        {
            try
            {
                var imagesPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
                
                if (!Directory.Exists(imagesPath))
                {
                    Directory.CreateDirectory(imagesPath);
                }

                // Open file explorer at the images directory
                System.Diagnostics.ProcessStartInfo psi = new System.Diagnostics.ProcessStartInfo();
                
                if (System.Runtime.InteropServices.RuntimeInformation.IsOSPlatform(System.Runtime.InteropServices.OSPlatform.Windows))
                {
                    psi.FileName = "explorer.exe";
                    psi.Arguments = imagesPath;
                }
                else if (System.Runtime.InteropServices.RuntimeInformation.IsOSPlatform(System.Runtime.InteropServices.OSPlatform.OSX))
                {
                    psi.FileName = "open";
                    psi.Arguments = imagesPath;
                }
                else if (System.Runtime.InteropServices.RuntimeInformation.IsOSPlatform(System.Runtime.InteropServices.OSPlatform.Linux))
                {
                    psi.FileName = "xdg-open";
                    psi.Arguments = imagesPath;
                }

                using (System.Diagnostics.Process.Start(psi))
                {
                }

                return Ok(new { message = "File browser opened" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
