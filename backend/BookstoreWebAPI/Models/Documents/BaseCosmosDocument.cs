using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.Documents
{
    public class BaseCosmosDocument
    {
        [JsonProperty("id")]
        public string Id { get; set; }
    }
}
