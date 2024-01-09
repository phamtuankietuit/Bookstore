using BookstoreWebAPI.Models.Interfaces;
using BookstoreWebAPI.Models.Shared;
using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.Documents
{
    public class ReturnOrderDocument : IBaseCosmosDocument
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("returnOrderId")]
        public string ReturnOrderId { get; set; }

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
        public int TotalItem { get; set; }

        [JsonProperty("totalQuantity")]
        public int TotalQuantity { get; set; }

        [JsonProperty("totalAmount")]
        public int TotalAmount { get; set; }

        [JsonProperty("note")]
        public string Note { get; set; }

        [JsonProperty("createdAt")]
        public DateTime? CreatedAt { get; set; }

        [JsonProperty("modifiedAt")]
        public DateTime? ModifiedAt { get; set; }

        [JsonProperty("ttl")]
        public int TTL { get; set; }
    }
}
