using HolidayLocation_API.Models;

namespace HolidayLocation_API.Repositories.IRepository
{
    public interface IBookingRepository : IRepository<Booking>
    {
        Task<IEnumerable<Booking>> GetBookingByPropertyIdAsync(int propertyId);

        // Get bookings for a specific property within a date range
        Task<IEnumerable<Booking>> GetBookingByDateRangeAsync(int propertyId,
            DateTime startDate,
            DateTime endDate);

        // Check if the porperty is available for the given date range
        Task<bool> IsPorpertyAvailableAsync(int propertyId, 
            DateTime checkIn,
            DateTime checkOut);

        // Get booked date
        Task<IEnumerable<Booking>> GetBookedDatesAsync(int propertyId,
            DateTime startDate,
            DateTime endDate);

        Task<Booking> UpdateBookingAsync(Booking booking);
        Task<int> GetNextAvailableIdAsync();
    }
}
