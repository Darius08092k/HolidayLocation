using System.ComponentModel.DataAnnotations;

namespace HolidayLocation_API.DTO
{

    public class RegisterRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "Confirmation password does not match.")]
        public string ConfirmPassword { get; set; }
    }

}
