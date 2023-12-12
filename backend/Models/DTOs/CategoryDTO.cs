using Newtonsoft.Json;

namespace SE100_BookstoreWebAPI.Models.DTOs
{
    public class CategoryDTO
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
    }
}
