using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.BindingModels
{
    public class LoginModel
    {
        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("password")]
        public string Password { get; set; }
    }
}
