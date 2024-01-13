using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.BindingModels
{
    public class LoginModel : BasePasswordModel
    {

        [JsonProperty("password")]
        public string Password { get; set; }
    }
}
