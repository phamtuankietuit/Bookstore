using Newtonsoft.Json;
using BookstoreWebAPI.Models.Shared;
using BookstoreWebAPI.Models.Abstracts;

namespace BookstoreWebAPI.Models.DTOs
{
    public class CustomerDTO : IBaseCosmosDTO
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("customerID")]
        public string CustomerID { get; set; }

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

        [JsonProperty("address")]
        public CustomerAddress Address { get; set; }

        [JsonProperty("note")]
        public string Note { get; set; }

        [JsonProperty("tags")]
        public List<object> Tags { get; set; }
        
        [JsonProperty("createdAt")]
        public DateTime CreatedAt { get; set; }
    }
}
