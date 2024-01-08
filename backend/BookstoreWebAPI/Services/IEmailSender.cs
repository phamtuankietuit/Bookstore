using BookstoreWebAPI.Models.Emails;

namespace BookstoreWebAPI.Services
{
    public interface IEmailSender
    {
        Task SendEmailAsync(Message message);
    }
}
