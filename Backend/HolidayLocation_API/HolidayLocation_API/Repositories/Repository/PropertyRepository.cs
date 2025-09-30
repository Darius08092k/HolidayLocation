using HolidayLocation_API.Data;
using HolidayLocation_API.Models;
using HolidayLocation_API.Repositories.IRepository;

namespace HolidayLocation_API.Repositories.Repository
{
    public class PropertyRepository : Repository<Property>, IPropertyRepository
    {
        private readonly AppDbContext _db;
        public PropertyRepository(AppDbContext appDbContext) : base(appDbContext)
        {
            _db = appDbContext;
        }

        public async Task<Property> UpdatePropertyAsync(Property property)
        {
            _db.Property.Update(property);
            await _db.SaveChangesAsync();
            return property;
        }
    }
}
