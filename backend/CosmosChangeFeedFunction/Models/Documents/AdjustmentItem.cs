using CosmosChangeFeedFunction.Models.Interfaces;
using Newtonsoft.Json;

namespace CosmosChangeFeedFunction.Models.Documents
{
    public class AdjustmentItem : IBaseCosmos
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("adjustmentItemId")]
        public string AdjustmentItemId { get; set; }

        [JsonProperty("adjustmentTicketId")]
        public string AdjustmentTicketId { get; set; }

        [JsonProperty("staffId")]
        public string StaffId { get; set; }

        [JsonProperty("adjustedQuantity")]
        public int? AdjustedQuantity { get; set; }

        [JsonProperty("quantity")]
        public int quantity { get; set; }

        [JsonProperty("reason")]
        public string Reason { get; set; }

        [JsonProperty("productId")]
        public string ProductId { get; set; }

        [JsonProperty("productName")]
        public string ProductName { get; set; }

        [JsonProperty("note")]
        public string? Note { get; set; }

        [JsonProperty("tags")]
        public List<object>? Tags { get; set; }

        [JsonProperty("createdAt")]
        public DateTime? CreatedAt { get; set; }

        [JsonProperty("modifiedAt")]
        public DateTime? ModifiedAt { get; set; }

        [JsonProperty("ttl")]
        public int TTL { get; set; }
    }
}
