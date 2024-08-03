using System.ComponentModel.DataAnnotations;

namespace PMS.API.Models
{
    public class LoginModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [StringLength(12, MinimumLength = 5)]
        [DataType(DataType.Password)]
        public string Password { get; set; }

    }
}
