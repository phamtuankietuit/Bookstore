using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.Shared
{
    public class SalesOrderInformation
    {
        [JsonProperty("lastOrderAt")]
        public DateTime LastOrderAt { get; set; }

        [JsonProperty("purchasedOrder")]
        public int PurchasedOrder { get; set; } = 0;

        [JsonProperty("orderedQuantity")]
        public int OrderedQuantity { get; set; } = 0;

        [JsonProperty("returnQuantity")]
        public int ReturnQuantity { get; set; } = 0;

        [JsonProperty("totalPay")]
        public int TotalPay { get; set; } = 0;
    }
}
