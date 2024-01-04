using BookstoreWebAPI.Models.Interfaces;
using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.DTOs
{
    public class CategoryDTO : IBaseCosmosDTO
    {
        [JsonProperty("categoryId")]
        public string? CategoryId { get; set; }

        [JsonProperty("name")]
        public string? Name { get; set; }

        [JsonProperty("text")]
        public string Text { get; set; }

        [JsonProperty("createdAt")]
        public DateTime? CreatedAt { get; set; }

        [JsonProperty("modifiedAt")]
        public DateTime? ModifiedAt { get; set; }

        [JsonProperty("staffId")]
        public string? StaffId { get; set; }
    }
}
