using Newtonsoft.Json;
using BookstoreWebAPI.Models.Shared;
using BookstoreWebAPI.Models.Interfaces;

namespace BookstoreWebAPI.Models.DTOs
{

    public class PurchaseOrderDTO : IBaseCosmosDTO, IDiscountDTO
    {
        [JsonProperty("purchaseOrderId")]
        public string? PurchaseOrderId { get; set; }

        [JsonProperty("supplierId")]
        public string SupplierId { get; set; }

        [JsonProperty("supplierName")]
        public string SupplierName { get; set; }

        [JsonProperty("items")]
        public List<PurchaseOrderItem> Items { get; set; }

        [JsonProperty("subTotal")]
        public int SubTotal { get; set; } = 0;

        [JsonProperty("tax")]
        public int Tax { get; set; } = 0;

        [JsonProperty("discountItems")]
        public List<DiscountItem>? DiscountItems { get; set; }

        [JsonProperty("discountRate")]
        public int DiscountRate { get; set; } = 0;

        [JsonProperty("discountValue")]
        public int DiscountValue { get; set; } = 0;
        
        [JsonProperty("discountAmount")]
        public int DiscountAmount { get; set; } = 0;

        [JsonProperty("totalAmount")]
        public int TotalAmount { get; set; } = 0;

        [JsonProperty("paymentDetails")]
        public PaymentDetails? PaymentDetails { get; set; }

        [JsonProperty("status")]
        public string? Status { get; set; }

        [JsonProperty("note")]
        public string? Note { get; set; }

        [JsonProperty("tags")]
        public List<string>? Tags { get; set; }

        [JsonProperty("createdAt")]
        public DateTime? CreatedAt { get; set; }

        [JsonProperty("modifiedAt")]
        public DateTime? ModifiedAt { get; set; }

        [JsonProperty("staffId")]
        public string? StaffId { get; set; }
    }
}
