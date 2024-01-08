using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.Shared
{
    public class OptionalDetails
    {
        [JsonProperty("name")]
        public string? Name { get; set; }
        
        [JsonProperty("value")]
        public string? Value { get; set; }
    }
}
