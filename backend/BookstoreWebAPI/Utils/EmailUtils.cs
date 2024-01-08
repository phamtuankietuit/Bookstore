using BookstoreWebAPI.Models.Emails;
using BookstoreWebAPI.Services;

namespace BookstoreWebAPI.Utils
{
    public class EmailUtils
    {
        private readonly IEmailSender _emailSender;

        public EmailUtils(IEmailSender emailSender)
        {
            _emailSender = emailSender;
        }

        public async Task SendDefaultPasswordToEmail(string email, string defaultPassword)
        {
            const string subject = "Mật khẩu đăng nhập bookstore";
            string body = $@"
    <html>
    <body>
    <p>Chào bạn,</p>
    <p>Mật khẩu đăng nhập của bạn là: <strong>{defaultPassword}</strong></p>
    <p>Hãy sử dụng mật khẩu này đăng nhập vào ứng dụng. Sau đó bạn sẽ được yêu cầu đặt mật khẩu cho tài khoản nhân viên của mình.</p>
    <p>Trân trọng,</p>
    <p>Quản trị viên</p>
    </body>
    </html>";

            var message = new Message(new string[] { email }, subject, body);
            await _emailSender.SendEmailAsync(message);
        }
    }
}
