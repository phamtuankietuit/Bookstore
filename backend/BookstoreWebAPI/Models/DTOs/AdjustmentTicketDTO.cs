using BookstoreWebAPI.Models.Shared;
using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.DTOs
{
    public class AdjustmentTicketDTO
    {

        [JsonProperty("adjustmentTicketId")]
        public string? AdjustmentTicketId { get; set; }

        [JsonProperty("staffId")]
        public string StaffId { get; set; }

        [JsonProperty("staffName")]
        public string? StaffName { get; set; }

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
        public string? Status { get; set; }

        [JsonProperty("totalItemsToAdjust")]
        public int? TotalItemsToAdjust { get; set; }

        [JsonProperty("adjustmentBalance")]
        public AdjustmentBalance? AdjustmentBalance { get; set; }

        [JsonProperty("note")]
        public string? Note { get; set; }

        [JsonProperty("tags")]
        public List<object>? Tags { get; set; }
    }
}
