using BookstoreWebAPI.Models.Interfaces;
using BookstoreWebAPI.Models.Shared;
using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.DTOs
{
    public class ReturnOrderDTO : IBaseCosmosDTO
    {
        [JsonProperty("returnOrderId")]
        public string? ReturnOrderId { get; set; }

        [JsonProperty("salesOrderId")]
        public string SalesOrderId { get; set; }

        [JsonProperty("customerId")]
        public string CustomerId { get; set; }

        [JsonProperty("customerName")]
        public string CustomerName { get; set; }

        [JsonProperty("staffId")]
        public string StaffId { get; set; }

        [JsonProperty("staffName")]
        public string StaffName { get; set; }

        [JsonProperty("items")]
        public List<ReturnOrderItem> Items { get; set; }

        [JsonProperty("totalItem")]
        public int TotalItem { get; set; } = 0;

        [JsonProperty("totalQuantity")]
        public int TotalQuantity { get; set; } = 0;

        [JsonProperty("totalAmount")]
        public int TotalAmount { get; set; } = 0;

        [JsonProperty("note")]
        public string? Note { get; set; }

        [JsonProperty("createdAt")]
        public DateTime? CreatedAt { get; set; }

        [JsonProperty("modifiedAt")]
        public DateTime? ModifiedAt { get; set; }
    }
}
