using BookstoreWebAPI.Models.Emails;
using MailKit.Net.Smtp;
using MimeKit;

namespace BookstoreWebAPI.Services
{
    public class EmailSender: IEmailSender
    {
        private readonly EmailConfiguration _emailConfig;
        private readonly ILogger<EmailSender> _logger;

        public EmailSender(
            EmailConfiguration emailConfig,
            ILogger<EmailSender> logger)
        {
            _emailConfig = emailConfig;
            _logger = logger;
        }
        public async Task SendEmailAsync(Message message)
        {
            var emailMessage = CreateEmailMessage(message);
            await Send(emailMessage);
        }

        private MimeMessage CreateEmailMessage(Message message)
        {
            var emailMessage = new MimeMessage();
            var title = "Quản trị viên";
            emailMessage.From.Add(new MailboxAddress(title, _emailConfig.From));
            emailMessage.To.AddRange(message.To);
            emailMessage.Subject = message.Subject;
            emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = message.Content };
            return emailMessage;
        }
        private async Task Send(MimeMessage mailMessage)
        {
            using (var client = new SmtpClient())
            {
                try
                {
                    await client.ConnectAsync(_emailConfig.SmtpServer, _emailConfig.Port, true);
                    client.AuthenticationMechanisms.Remove("XOAUTH2");
                    await client.AuthenticateAsync(_emailConfig.UserName, _emailConfig.Password);
                    await client.SendAsync(mailMessage);
                    _logger.LogInformation("Successfully sent email");
                }
                catch
                {
                    //log an error message or throw an exception or both.

                    _logger.LogError($"Failed to send email from {_emailConfig.UserName}");
                    throw;
                }
                finally
                {
                    client.Disconnect(true);
                    client.Dispose();
                }
            }
        }
    }
}
