using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.BindingModels
{
    public class UpdatePasswordModel
    {
        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("oldPassword")]
        public string OldPassword { get; set; }

        [JsonProperty("newPassword")]
        public string NewPassword { get; set; }
    }
}
