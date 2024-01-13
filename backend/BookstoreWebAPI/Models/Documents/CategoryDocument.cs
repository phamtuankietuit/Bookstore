using BookstoreWebAPI.Models.Interfaces;
using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.Documents
{
    public class CategoryDocument : IBaseCosmosDocument, ISoftDeleteCosmosDocument
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("categoryId")]
        public string CategoryId { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("text")]
        public string Text { get; set; }

        [JsonProperty("isDeleted")]
        public bool IsDeleted { get; set; }

        [JsonProperty("isRemovable")]
        public bool IsRemovable { get; set; }

        [JsonProperty("createdAt")]
        public DateTime? CreatedAt { get; set; }

        [JsonProperty("modifiedAt")]
        public DateTime? ModifiedAt { get; set; }

        [JsonProperty("ttl")]
        public int TTL { get; set; }

        [JsonProperty("staffId")]
        public string StaffId { get; set; }
    }
}
