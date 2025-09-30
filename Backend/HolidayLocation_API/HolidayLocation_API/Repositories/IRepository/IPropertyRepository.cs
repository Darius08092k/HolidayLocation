using HolidayLocation_API.Models;

namespace HolidayLocation_API.Repositories.IRepository
{
    public interface IPropertyRepository: IRepository<Property>
    {
        Task<Property> UpdatePropertyAsync(Property property);
    }
}
