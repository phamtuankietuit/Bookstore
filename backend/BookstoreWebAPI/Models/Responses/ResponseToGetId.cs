using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.Responses
{
    public class ResponseToGetId
    {
        [JsonProperty("id")]
        public string Id { get; set; }
    }
}
