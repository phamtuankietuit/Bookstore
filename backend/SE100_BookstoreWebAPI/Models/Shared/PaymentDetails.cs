using Newtonsoft.Json;

namespace SE100_BookstoreWebAPI.Models.Shared
{
    public class PaymentDetails
    {
        [JsonProperty("remainAmount")]
        public int RemainAmount { get; set; }

        [JsonProperty("paidAmount")]
        public int PaidAmount { get; set; }

        [JsonProperty("paymentMethod")]
        public string PaymentMethod { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }
    }
}
