using Newtonsoft.Json;
using BookstoreWebAPI.Models.Shared;

namespace BookstoreWebAPI.Models.Documents
{
    public class SalesOrderDocument : BaseCosmosDocument
    {
        [JsonProperty("orderId")]
        public string OrderId { get; set; }

        [JsonProperty("createdAt")]
        public DateTime CreatedAt { get; set; }

        [JsonProperty("monthYear")]
        public string MonthYear { get; set; }

        [JsonProperty("returnDate")]
        public DateTime ReturnDate { get; set; }

        [JsonProperty("customerType")]
        public string CustomerType { get; set; }

        [JsonProperty("items")]
        public List<SaleOrderItem> Items { get; set; }

        [JsonProperty("subtotal")]
        public int Subtotal { get; set; }

        [JsonProperty("discounts")]
        public OrderDiscount Discounts { get; set; }

        [JsonProperty("tax")]
        public int Tax { get; set; }

        [JsonProperty("totalAmount")]
        public int TotalAmount { get; set; }

        [JsonProperty("paymentMethod")]
        public string PaymentMethod { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }

        [JsonProperty("note")]
        public string Note { get; set; }

        [JsonProperty("isDeleted")]
        public bool IsDeleted { get; set; }
    }
}
