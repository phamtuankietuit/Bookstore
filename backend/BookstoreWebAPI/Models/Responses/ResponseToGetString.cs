using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.Responses
{
    public class ResponseToGetString
    {
        [JsonProperty]
        public string Value { get; set; }
    }
}
