using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.Responses;

namespace BookstoreWebAPI.Repository.Interfaces
{
    public interface IAccountRepository
    {
        Task<AuthenticateResult> AuthenticateUser(LoginModel data);
        Task UpdatePasswordAsync(UpdatePasswordModel data);
        Task ForgotPasswordAsync(string email);
    }
}
