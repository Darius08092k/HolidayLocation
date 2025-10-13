using Azure.Core;
using HolidayLocation_API.Data;
using HolidayLocation_API.Models;
using HolidayLocation_API.Repositories.IRepository;
using Microsoft.EntityFrameworkCore;

namespace HolidayLocation_API.Repositories.Repository
{
    public class BookingRepository : Repository<Booking>, IBookingRepository
    {
        private readonly AppDbContext _db;
        public BookingRepository(AppDbContext appDbContext) : base(appDbContext)
        {
            _db = appDbContext;

        }

        public async Task<IEnumerable<DateTime>> GetBookedDatesAsync(int propertyId, DateTime startDate, DateTime endDate)
        {
            var bookings = await GetBookingByDateRangeAsync(propertyId, startDate, endDate);
            var bookedDates = new List<DateTime>();

            foreach (var booking in bookings)
            {
                var currentDate = booking.BookingDate.Date;
                while(currentDate < booking.CheckOutDate.Date)
                {
                    if(currentDate >= startDate.Date && currentDate <= endDate.Date)
                    {
                        bookedDates.Add(currentDate);   
                    }
                    currentDate = currentDate.AddDays(1);
                }
            }
            return bookedDates.Distinct().OrderBy(x => x);
        }

        public async Task<IEnumerable<Booking>> GetBookingByDateRangeAsync(int propertyId, DateTime startDate, DateTime endDate)
        {
            return await _db.Bookings
                .Where(b => b.PropertyId == propertyId &&
                            b.Status != "Cancelled" &&
                            b.CheckInDate <= endDate &&
                            b.CheckOutDate >= startDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Booking>> GetBookingByPropertyIdAsync(int propertyId)
        {
            return await _db.Bookings
                .Include(prop => prop.Property)
                .Where(b => b.PropertyId == propertyId && b.Status != "Cancelled")
                .OrderBy(b => b.CheckInDate)
                .ToListAsync();
        }

        public Task<int> GetNextAvailableIdAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<bool> IsPorpertyAvailableAsync(int propertyId, DateTime checkIn, DateTime checkOut)
        {
            var existingBookings = await _db.Bookings
                .Where(b => b.PropertyId == propertyId &&
                            b.Status != "Cancelled" &&
                            /* Check for: 
                             Exisitng booking starts before/on requested data, and ends after requested check-in.
                             (Ex: Existing: 1 Jan - 10 Jan -> Requested: 5 Jan - 15 Jan => Gets Rejected */
                            ((b.CheckInDate <= checkIn && b.CheckOutDate > checkIn) ||
                             /* Check for: 
                                Exisitng booking starts before check-out date, and ends on/after requested check-out.
                                 (Ex: Existing: 10 Jan - 20 Jan -> Requested: 5 Jan - 15 Jan => Gets Rejected */
                             (b.CheckInDate < checkOut && b.CheckOutDate >= checkOut) ||
                             /* Check for: 
                                Exisitng booking starts on/after requested check-in date, and ends before/on requested check-out.
                                (Ex: Existing: 10 Jan - 20 Jan -> Requested: 5 Jan - 25 Jan => Gets Rejected */
                             (b.CheckInDate >= checkIn && b.CheckOutDate <= checkOut)))
                .CountAsync();

            // No conflicting bookings exist
            return existingBookings == 0;
        }

        public Task<Booking> UpdateBookingAsync(Booking booking)
        {
            throw new NotImplementedException();
        }
    }
}
