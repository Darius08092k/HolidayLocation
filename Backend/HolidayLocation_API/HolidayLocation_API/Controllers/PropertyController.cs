using HolidayLocation_API.Models;
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
        public async Task<IActionResult> GetProperties()
        {
            var villaList = await _dbVilla.GetAllAsync();
            return Ok(villaList);
        }

        //[HttpDelete("{id:int}", Name = "DeleteProperty")]

    }
}
