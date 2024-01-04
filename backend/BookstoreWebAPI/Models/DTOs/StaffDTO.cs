using BookstoreWebAPI.Models.Interfaces;
using BookstoreWebAPI.Models.Shared;
using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.DTOs
{
    public class StaffDTO : IBaseCosmosDTO
    {
        [JsonProperty("staffId")]
        public string? StaffId { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

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

    }
}
