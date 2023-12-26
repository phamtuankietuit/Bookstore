using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.DTOs
{
    public class CategoryDTO
    {
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
