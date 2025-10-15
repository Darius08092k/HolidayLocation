using HolidayLocation_API.Models;
using HolidayLocation_API.Repositories.IRepository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Writers;
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
        [Authorize(Roles = "User,Admin")]
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

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Booking>> GetBooking(int id)
        {
            var booking = await _bookingRepository.GetByIdAsync(id);
            if (booking == null)
            {
                return NotFound();
            }
            return Ok(booking);
        }

        [HttpGet("property/{propertyId}")]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookingsByPropertyId(int propertyId)
        {
            var bookings = await _bookingRepository.GetBookingByPropertyIdAsync(propertyId);
            return Ok(bookings);
        }

        [HttpGet("property/{propertyId}/availability")]
        public async Task<ActionResult<bool>> CheckPropertyAvailability(int propertyId, 
                                                DateTime checkIn, 
                                                DateTime checkOut)
        {
            if(checkIn >= checkOut)
            {
                return BadRequest("Check-out date must be later than check-in date.");
            }

            var isAvailable = await _bookingRepository.IsPorpertyAvailableAsync(propertyId, checkIn, checkOut);
            return Ok(isAvailable);
        }

        [HttpGet("property/{propertyId}/bookedDates")]
        public async Task<ActionResult<IEnumerable<DateTime>>> GetBookedDates(int propertyId,
                                                DateTime startDate,
                                                DateTime endDate)
        {
            if (startDate >= endDate)
            {
                return BadRequest("End date must be later than start date.");
            }

            var bookedDates = await _bookingRepository.GetBookedDatesAsync(propertyId, startDate, endDate);
            return Ok(bookedDates);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await _bookingRepository.GetByIdAsync(id);
            if (booking == null)
            {
                return NotFound();
            }
            await _bookingRepository.DeleteAsync(id);
            return NoContent();
        }


    }
}
