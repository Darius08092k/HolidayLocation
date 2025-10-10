﻿﻿﻿﻿﻿﻿﻿using HolidayLocation_API.Models;
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

        [HttpDelete("all")]
        public async Task<IActionResult> DeleteAllProperty()
        {
            await _dbVilla.DeleteAllAsync();
            return NoContent();
        }

        [HttpPost("seed-image-urls")]
        public async Task<IActionResult> SeedImageUrls()
        {
            // Get all properties
            var properties = await _dbVilla.GetAllAsync();

            // Update specific properties with image URLs
            var updates = new Dictionary<int, string>
            {
                { 1, "/images/Villa1/villa1-main.jpg" },
                { 2, "/images/Villa2/villa2-main.jpg" },
                { 3, "/images/Villa3/villa3-main.jpg" }
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


    }
}
