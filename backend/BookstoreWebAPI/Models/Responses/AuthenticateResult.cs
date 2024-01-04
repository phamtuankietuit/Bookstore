using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;

namespace BookstoreWebAPI.Models.Responses
{
    public class AuthenticateResult
    {
        public StaffDTO User { get; set; }
        public string Token { get; set; }
    }
}
