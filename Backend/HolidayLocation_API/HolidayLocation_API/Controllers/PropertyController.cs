﻿﻿﻿﻿﻿﻿using HolidayLocation_API.Models;
using HolidayLocation_API.Repositories.IRepository;
using HolidayLocation_API.Repositories.Repository;
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
        public async Task<ActionResult<Property>> CreateProperty(Property property)
        {
            await _dbVilla.CreateAsync(property);
            return Ok(property);
        }

        [HttpPost("upload-image/{propertyId:int}")]
        public async Task<IActionResult> UploadPropertyImage(int propertyId, IFormFile imageFile)
        {
            try
            {
                // Generate unique filename
                var fileName = $"property_{propertyId}_{Guid.NewGuid()}{fileExtension}";
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
                var filePath = Path.Combine(uploadsFolder, fileName);

                // Save the file
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(fileStream);
                }

                // Update property with image URL
                var imageUrl = $"/images/{fileName}";
                property.ImageUrl = imageUrl;
                await _dbVilla.UpdatePropertyAsync(property);

                return Ok(new { imageUrl = imageUrl, fileName = fileName });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error uploading image: {ex.Message}");
            }
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

        [HttpDelete]
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

        [HttpGet("image/{propertyId:int}")]
        public async Task<IActionResult> GetPropertyImage(int propertyId)
        {
            var property = await _dbVilla.GetByIdAsync(propertyId);
            if (property == null)
            {
                return NotFound($"Property with ID {propertyId} not found");
            }

            if (string.IsNullOrEmpty(property.ImageUrl))
            {
                return NotFound("No image found for this property");
            }

            return Ok(new { imageUrl = property.ImageUrl });
        }

        [HttpDelete("image/{propertyId:int}")]
        public async Task<IActionResult> DeletePropertyImage(int propertyId)
        {
            var property = await _dbVilla.GetByIdAsync(propertyId);
            if (property == null)
            {
                return NotFound($"Property with ID {propertyId} not found");
            }

            if (string.IsNullOrEmpty(property.ImageUrl))
            {
                return NotFound("No image found for this property");
            }

            try
            {
                // Extract filename from ImageUrl
                var fileName = Path.GetFileName(property.ImageUrl);
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", fileName);

                // Delete physical file if it exists
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }

                // Clear ImageUrl from property
                property.ImageUrl = string.Empty;
                await _dbVilla.UpdatePropertyAsync(property);

                return Ok(new { message = "Image deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deleting image: {ex.Message}");
            }
        }

    }
}
