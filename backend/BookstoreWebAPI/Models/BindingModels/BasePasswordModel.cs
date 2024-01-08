using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.BindingModels
{
    public class BasePasswordModel
    {
        [JsonProperty("email")]
        public string? Email { get; set; }
    }
}
