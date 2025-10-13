using HolidayLocation_API.Models;
using HolidayLocation_API.Repositories.IRepository;
using Microsoft.AspNetCore.Mvc;
using System.Net.NetworkInformation;

namespace HolidayLocation_API.Controllers
{
    [Route("api/BookingAPI")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly IPropertyRepository _propertyRepository;

        public BookingController(IBookingRepository bookingRepository, IPropertyRepository propertyRepository)
        {
            _bookingRepository = bookingRepository;
            _propertyRepository = propertyRepository;
        }

        [HttpPost]
        public async Task<ActionResult<Booking>> CreateBooking(Booking booking)
        {
            // Get next property ID
            //var nextId = await _bookingRepository.GetNextAvailableIdAsync();
            //booking.BookingId = nextId;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var propertyExists = await _propertyRepository.PropertyExistsAsync(booking.PropertyId);
            if (!propertyExists)
            {
                return NotFound($"Property with ID {booking.PropertyId} not found.");
            }

            // Ignore any nested property object and let DB generate BookingId
            booking.Property = null;
            booking.BookingId = 0;

            var isAvailable = await _bookingRepository.IsPorpertyAvailableAsync(
                booking.PropertyId, booking.CheckInDate, booking.CheckOutDate);

            if (!isAvailable)
            {
                return BadRequest("Propery is not available for the selected dates");
            }

            await _bookingRepository.CreateAsync(booking);
            return Ok(booking);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Booking>>> GetAllBookings()
        {
            var bookingList = await _bookingRepository.GetAllAsync();
            return Ok(bookingList);
        }

    }
}
