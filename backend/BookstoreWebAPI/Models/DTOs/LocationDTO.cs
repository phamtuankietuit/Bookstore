using BookstoreWebAPI.Models.Shared;
using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.DTOs
{
    public class LocationDTO
    {
        [JsonProperty("locationId")]
        public string LocationId { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("contact")]
        public Contact Contact { get; set; }

        [JsonProperty("address")]
        public string Address { get; set; }

        [JsonProperty("createAt")]
        public DateTime CreateAt { get; set; }

        [JsonProperty("modifedAt")]
        public DateTime ModifedAt { get; set; }

        [JsonProperty("adminId")]
        public string AdminId { get; set; }
    }
}
