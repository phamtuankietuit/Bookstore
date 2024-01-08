using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.BindingModels
{
    public class ForgotPasswordModel : BasePasswordModel
    {
        [JsonProperty("newPassword")]
        public string NewPassword { get; set; }
    }
}
