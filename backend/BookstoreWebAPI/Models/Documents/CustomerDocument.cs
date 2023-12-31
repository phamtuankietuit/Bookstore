using Newtonsoft.Json;
using BookstoreWebAPI.Models.Shared;

namespace BookstoreWebAPI.Models.Documents
{
    public class CustomerDocument : BaseCosmosDocument
    {
        [JsonProperty("customerId")]
        public string CustomerId { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("sex")]
        public string Sex { get; set; }

        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("phoneNumber")]
        public string PhoneNumber { get; set; }

        [JsonProperty("salesOrder")]
        public CustomerSalesOrder SalesOrder { get; set; }

        [JsonProperty("createdAt")]
        public DateTime CreatedAt { get; set; }

        [JsonProperty("address")]
        public CustomerAddress Address { get; set; }

        [JsonProperty("note")]
        public string Note { get; set; }

        [JsonProperty("tags")]
        public List<object> Tags { get; set; }
    }
}
