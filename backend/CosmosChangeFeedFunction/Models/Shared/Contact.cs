using Newtonsoft.Json;

namespace CosmosChangeFeedFunction.Models.Documentshared
{
    public class Contact
    {
        [JsonProperty("phone")]
        public string? Phone { get; set; }

        [JsonProperty("email")]
        public string Email { get; set; }
    }
}
