using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PMS.API.Interfaces;
using PMS.API.Models;

namespace PMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> RegisterAsync([FromBody]SignUpModel model)
        {
            if (ModelState.IsValid)
            {
                var result = await _userService.RegisterUserAsync(model);
                 return Ok(result);
            }

            return BadRequest("Some Properties are not matching.");
        }

        [HttpPost("Login")]
        public async Task<IActionResult> LoginAsync([FromBody]LoginModel model)
        {
            if (ModelState.IsValid)
            {
                var result = await _userService.LoginUserAsync(model);

                if (result.IsSuccess)
                {
                    var cookieOptions = new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true,
                        Expires = result.ExpireDate,
                        SameSite = SameSiteMode.None 
                    };

                    Response.Cookies.Append("access_token", result.Message, cookieOptions);

                    return Ok(result);
                }
                // sending OK to catch the Message, Change this to Bad request
                return Ok(result);

            }
            return BadRequest("Something went wrong!");

        }

    }
}
