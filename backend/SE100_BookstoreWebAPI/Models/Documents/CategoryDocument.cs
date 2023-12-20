using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.Documents
{
    public class CategoryDocument
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("categoryId")]
        public string CategoryId { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("text")]
        public string Text { get; set; }

        [JsonProperty("attributes")]
        public List<string> Attributes { get; set; }

        [JsonProperty("isDeleted")]
        public bool IsDeleted { get; set; }

        [JsonProperty("ttl")]
        public int TTL { get; set; }
    }
}
