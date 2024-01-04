using BookstoreWebAPI.Models.Interfaces;
using BookstoreWebAPI.Models.Shared;
using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.Documents
{
    public class StaffDocument : IBaseCosmosDocument, ISoftDeleteCosmosDocument
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("staffId")]
        public string StaffId { get; set; }
        
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("hashedAndSaltedPassword")]
        public string? HashedAndSaltedPassword { get; set; }
        [JsonProperty("defaultPassword")]
        public string? DefaultPassword { get; set; }

        [JsonProperty("contact")]
        public Contact Contact { get; set; }

        [JsonProperty("profileImage")]
        public string? ProfileImage { get; set; }

        [JsonProperty("role")]
        public string Role { get; set; }

        [JsonProperty("address")]
        public string? Address { get; set; }

        [JsonProperty("note")]
        public string? Note { get; set; }

        [JsonProperty("createdAt")]
        public DateTime? CreatedAt { get; set; }

        [JsonProperty("modifiedAt")]
        public DateTime? ModifiedAt { get; set; }
        
        [JsonProperty("isDeleted")]
        public bool IsDeleted { get; set; }
        
        [JsonProperty("isRemovable")]
        public bool IsRemovable { get; set; }

        [JsonProperty("ttl")]
        public int TTL { get; set; }
    }
}
