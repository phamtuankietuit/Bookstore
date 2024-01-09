using CosmosChangeFeedFunction.Models.Interfaces;
using Newtonsoft.Json;
using CosmosChangeFeedFunction.Models.Shared;

namespace CosmosChangeFeedFunction.Models.Documents
{
    public class AdjustmentTicket : IBaseCosmos
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("adjustmentTicketId")]
        public string AdjustmentTicketId { get; set; }

        [JsonProperty("staffId")]
        public string StaffId { get; set; }

        [JsonProperty("staffName")]
        public string StaffName { get; set; }

        [JsonProperty("adjustedStaffId")]
        public string? AdjustedStaffId { get; set; }

        [JsonProperty("adjustedStaffName")]
        public string? AdjustedStaffName { get; set; }

        [JsonProperty("adjustedAt")]
        public DateTime? AdjustedAt { get; set; }

        [JsonProperty("createdAt")]
        public DateTime? CreatedAt { get; set; }

        [JsonProperty("modifiedAt")]
        public DateTime? ModifiedAt { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }

        [JsonProperty("totalItemsToAdjust")]
        public int TotalItemsToAdjust { get; set; } // number of items to adjust

        [JsonProperty("adjustmentBalance")]
        public AdjustmentBalance AdjustmentBalance { get; set; }

        [JsonProperty("tags")]
        public List<object> Tags { get; set; }

        [JsonProperty("note")]
        public string Note { get; set; }

        [JsonProperty("isCancelable")]
        public bool IsCancelable { get; set; }

        [JsonProperty("isCanceled")]
        public bool IsCanceled { get; set; }

        [JsonProperty("ttl")]
        public int TTL { get; set; }
    }
}
