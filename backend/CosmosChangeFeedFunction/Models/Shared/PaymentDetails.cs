using Newtonsoft.Json;

namespace CosmosChangeFeedFunction.Models.Shared
{
    public class PaymentDetails
    {
        [JsonProperty("remainAmount")]
        public int RemainAmount { get; set; } = 0;

        [JsonProperty("paidAmount")]
        public int PaidAmount { get; set; } = 0;

        [JsonProperty("paymentMethod")]
        public string? PaymentMethod { get; set; }

        [JsonProperty("status")]
        public string? Status { get; set; }
    }
}
