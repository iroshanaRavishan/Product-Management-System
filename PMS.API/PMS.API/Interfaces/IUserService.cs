using PMS.API.Models;

namespace PMS.API.Interfaces
{
    public interface IUserService
    {
        Task<UserManagerResponse> RegisterUserAsync(SignUpModel model);
        Task<UserManagerResponse> LoginUserAsync(LoginModel model);
    }
}
