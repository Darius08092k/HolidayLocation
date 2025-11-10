using System.ComponentModel.DataAnnotations;

namespace HolidayLocation_API.DTO
{
    public class UpdateUserRequest
    {
        [EmailAddress]
        public string? Email { get; set; }

        public string? UserName { get; set; }

        public string? PhoneNumber { get; set; }
        
        public string[]? Roles { get; set; }
    }
}