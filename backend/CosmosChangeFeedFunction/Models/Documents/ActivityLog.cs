using CosmosChangeFeedFunction.Models.Interfaces;
using Newtonsoft.Json;

namespace CosmosChangeFeedFunction.Models.Documents
{
    public class ActivityLog : IBaseCosmos
    {
        
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("activityId")]
        public string ActivityId { get; set; }

        [JsonProperty("staffId")]
        public string StaffId { get; set; }
        
        [JsonProperty("staffName")]
        public string StaffName { get; set; }

        [JsonProperty("activityType")]
        public string ActivityType { get; set; }

        [JsonProperty("activityName")]
        public string ActivityName { get; set; }

        [JsonProperty("createdAt")]
        public DateTime? CreatedAt { get; set; }
        
        [JsonProperty("modifiedAt")]
        public DateTime? ModifiedAt { get; set; }
        
        [JsonProperty("ttl")]
        public int TTL { get; set; }
    }
}
