using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.DTOs
{
    public class ResponseToGetId
    {
        [JsonProperty("id")]
        public string Id { get; set; }
    }
}
