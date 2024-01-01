using Newtonsoft.Json;
using BookstoreWebAPI.Models.Shared;
using BookstoreWebAPI.Models.Abstracts;

namespace BookstoreWebAPI.Models.Documents
{

    public class PurchaseOrderDocument : IBaseCosmosDocument, ISoftDeleteCosmosDocument
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        
        [JsonProperty("purchaseOrderId")]
        public string PurchaseOrderId { get; set; }

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
        
        [JsonProperty("isDeleted")]
        public bool IsDeleted { get; set; }
        
        [JsonProperty("isRemovable")]
        public bool IsRemovable { get; set; }
        
        [JsonProperty("createdAt")]
        public DateTime CreatedAt { get; set; }
        
        [JsonProperty("ttl")]
        public int TTL { get; set; }
    }
}
