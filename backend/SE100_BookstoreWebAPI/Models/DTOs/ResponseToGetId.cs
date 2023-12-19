using Newtonsoft.Json;

namespace SE100_BookstoreWebAPI.Models.DTOs
{
    public class ResponseToGetId
    {
        [JsonProperty("id")]
        public string Id { get; set; }
    }
}
