﻿﻿using HolidayLocation_API.Models;
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

    }
}
