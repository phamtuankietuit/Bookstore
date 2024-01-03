using BookstoreWebAPI.Models.Interfaces;
using BookstoreWebAPI.Models.Shared;
using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.Documents
{
    public class StaffDocument : IBaseCosmosDocument
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("staffId")]
        public string StaffId { get; set; }

        [JsonProperty("contact")]
        public Contact Contact { get; set; }

        [JsonProperty("profileImage")]
        public string ProfileImage { get; set; }

        [JsonProperty("role")]
        public string Role { get; set; }

        [JsonProperty("address")]
        public string Address { get; set; }

        [JsonProperty("note")]
        public string Note { get; set; }

        [JsonProperty("createdAt")]
        public DateTime? CreatedAt { get; set; }

        [JsonProperty("ttl")]
        public int TTL { get; set; }

    }
}
