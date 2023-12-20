using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.Shared
{
    public class CustomerSalesOrder
    {
        [JsonProperty("lastOrderAt")]
        public string LastOrderAt { get; set; }

        [JsonProperty("purchasedOrder")]
        public int PurchasedOrder { get; set; }

        [JsonProperty("orderedQuantity")]
        public int OrderedQuantity { get; set; }

        [JsonProperty("returnQuantity")]
        public int ReturnQuantity { get; set; }

        [JsonProperty("totalPay")]
        public int TotalPay { get; set; }
    }
}
