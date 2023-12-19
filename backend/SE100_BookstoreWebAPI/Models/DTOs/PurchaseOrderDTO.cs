using Newtonsoft.Json;
using SE100_BookstoreWebAPI.Models.Shared;

namespace SE100_BookstoreWebAPI.Models.DTOs
{

    public class PurchaseOrderDTO
    {
        [JsonProperty("purchaseOrderId")]
        public string PurchaseOrderId { get; set; }

        [JsonProperty("createAt")]
        public DateTime CreateAt { get; set; }

        [JsonProperty("monthYear")]
        public string MonthYear { get; set; }

        [JsonProperty("supplierId")]
        public string SupplierId { get; set; }

        [JsonProperty("supplierName")]
        public string SupplierName { get; set; }

        [JsonProperty("items")]
        public List<PurchaseOrderItem> Items { get; set; }

        [JsonProperty("subTotal")]
        public int SubTotal { get; set; }

        [JsonProperty("tax")]
        public int Tax { get; set; }

        [JsonProperty("discount")]
        public int Discount { get; set; }

        [JsonProperty("totalAmount")]
        public int TotalAmount { get; set; }

        [JsonProperty("paymentDetails")]
        public PaymentDetails PaymentDetails { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }

        [JsonProperty("note")]
        public string Note { get; set; }

        [JsonProperty("tags")]
        public List<string> Tags { get; set; }
    }
}
