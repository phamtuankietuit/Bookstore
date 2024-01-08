using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace BookstoreWebAPI.Models.Responses
{
    public class AuthenticateResult
    {
        [JsonProperty("user")]
        public StaffDTO User { get; set; }

        [JsonProperty("needReset")]
        public bool NeedReset { get; set; }

        [JsonProperty("token")]
        public string Token { get; set; }

        [JsonProperty("refreshToken")]
        public string RefreshToken { get; set; }
    }
}
