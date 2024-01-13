using Newtonsoft.Json;
using BookstoreWebAPI.Models.Shared;
using BookstoreWebAPI.Models.Interfaces;

namespace BookstoreWebAPI.Models.Documents
{
    public class CustomerDocument : IBaseCosmosDocument, ISoftDeleteCosmosDocument, IActivatableDocument
    {   
        [JsonProperty("id")]
        public string Id { get; set; }

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

        [JsonProperty("salesOrderInformation")]
        public SalesOrderInformation SalesOrderInformation { get; set; }

        [JsonProperty("address")]
        public string Address { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("note")]
        public string Note { get; set; }

        [JsonProperty("tags")]
        public List<object> Tags { get; set; }

        [JsonProperty("isActive")]
        public bool IsActive { get; set; }

        [JsonProperty("isDeleted")]
        public bool IsDeleted { get; set; }
        
        [JsonProperty("isRemovable")]
        public bool IsRemovable { get; set; }

        [JsonProperty("createdAt")]
        public DateTime? CreatedAt { get; set; }

        [JsonProperty("modifiedAt")]
        public DateTime? ModifiedAt { get; set; }

        [JsonProperty("ttl")]
        public int TTL { get; set; }

        [JsonProperty("staffId")]
        public string StaffId { get; set; }
    }
}
