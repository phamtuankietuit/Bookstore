using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.Shared
{
    public class CustomerAddress
    {
        [JsonProperty("address")]
        public string? Address { get; set; }

        [JsonProperty("phoneNumber")]
        public string? PhoneNumber { get; set; }

        [JsonProperty("name")]
        public string? Name { get; set; }

        [JsonProperty("email")]
        public string? Email { get; set; }
    }
}
