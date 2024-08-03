using System.ComponentModel.DataAnnotations;

namespace PMS.API.Models
{
    public class SignUpModel
    {
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [StringLength(12, MinimumLength =5)]
        [Compare("ConfirmPassword")]
        public string Password { get; set; }
        [Required]
        [StringLength(12, MinimumLength = 5)]
        public string ConfirmPassword { get; set; }
    }
}
