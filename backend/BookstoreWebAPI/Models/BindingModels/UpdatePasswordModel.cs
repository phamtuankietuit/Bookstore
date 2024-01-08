using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.BindingModels
{
    public class UpdatePasswordModel : ForgotPasswordModel
    {
        [JsonProperty("oldPassword")]
        public string OldPassword { get; set; }
    }
}
