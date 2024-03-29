﻿using Newtonsoft.Json;
using CosmosChangeFeedFunction.Models.Interfaces;
using CosmosChangeFeedFunction.Models.Shared;

namespace CosmosChangeFeedFunction.Models.Documents
{
    public class SalesOrder : IBaseCosmos, IDiscount
    {
        [JsonProperty("id")]
        public string Id { get; set; }
      
        [JsonProperty("salesOrderId")]
        public string SalesOrderId { get; set; }
      
        [JsonProperty("monthYear")]
        public string MonthYear { get; set; }
      
        [JsonProperty("returnDate")]
        public DateTime ReturnDate { get; set; }
      
        [JsonProperty("customerType")]
        public string CustomerType { get; set; }

        [JsonProperty("customerId")]
        public string CustomerId { get; set; }

        [JsonProperty("customerName")]
        public string CustomerName { get; set; }

        [JsonProperty("items")]
        public List<SalesOrderItem> Items { get; set; }
      
        [JsonProperty("subtotal")]
        public int Subtotal { get; set; }
      
        [JsonProperty("discountItems")]
        public List<DiscountItem>? DiscountItems { get; set; }
      
        [JsonProperty("discountRate")]
        public int DiscountRate { get; set; } = 0;
      
        [JsonProperty("discountValue")]
        public int DiscountValue { get; set; } = 0;
      
        [JsonProperty("discountAmount")]
        public int DiscountAmount { get; set; } = 0;
      
        [JsonProperty("tax")]
        public int Tax { get; set; }
      
        [JsonProperty("totalAmount")]
        public int TotalAmount { get; set; }
      
        [JsonProperty("paymentDetails")]
        public PaymentDetails PaymentDetails { get; set; }
      
        [JsonProperty("status")]
        public string Status { get; set; }
      
        [JsonProperty("note")]
        public string Note { get; set; }
      
        [JsonProperty("createdAt")]
        public DateTime? CreatedAt { get; set; }

        [JsonProperty("modifiedAt")]
        public DateTime? ModifiedAt { get; set; }

        [JsonProperty("ttl")]
        public int TTL { get; set; }

        [JsonProperty("staffId")]
        public string StaffId { get; set; }

        [JsonProperty("staffName")]
        public string StaffName { get; set; }
    }
}
