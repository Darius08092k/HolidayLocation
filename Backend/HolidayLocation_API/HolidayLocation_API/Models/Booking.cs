using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HolidayLocation_API.Models
{
    public class Booking
    {
        [Key]
        public int BookingId { get; set; }
        [Required]
        public int PropertyId { get; set; }
        [ForeignKey("PropertyId")]
        public Property Property { get; set; }

        [Required]
        public DateTime CheckInDate { get; set; }
        [Required]
        public DateTime CheckOutDate { get; set; }
        [Required]
        public string CustomerName { get; set; }
        [Required]
        public string CustomerEmail { get; set; }
        [StringLength(20)]
        public string CustomerPhone { get; set; }
        public DateTime BookingDate { get; set; } = DateTime.Now;

        [StringLength(20)]
        public string Status { get; set; } = "Confirmed"; // e.g., Pending, Confirmed, Cancelled

    }
}
