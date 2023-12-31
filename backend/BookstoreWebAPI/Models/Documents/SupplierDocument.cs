using Newtonsoft.Json;
using BookstoreWebAPI.Models.Shared;

namespace BookstoreWebAPI.Models.Documents
{

    public class SupplierDocument : BaseCosmosDocument
    {
        [JsonProperty("supplierId")]
        public string SupplierId { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("supplierGroupId")]
        public string SupplierGroupId { get; set; }

        [JsonProperty("supplierGroupName")]
        public string SupplierGroupName { get; set; }

        [JsonProperty("contact")]
        public Contact Contact { get; set; }

        [JsonProperty("address")]
        public string Address { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("createdAt")]
        public DateTime CreatedAt { get; set; }

        [JsonProperty("isActive")]
        public bool IsActive { get; set; }

        [JsonProperty("isDeleted")]
        public bool IsDeleted { get; set; }

        [JsonProperty("ttl")]
        public int TTL { get; set; }
    }
}
