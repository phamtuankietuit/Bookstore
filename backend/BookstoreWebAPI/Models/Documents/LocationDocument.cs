using BookstoreWebAPI.Models.Shared;
using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.Documents
{
    public class LocationDocument
    {
        [JsonProperty("id")]
        public string Id { get; set; }

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

        [JsonProperty("ttl")]
        public int TTL { get; set; }
    }
}
