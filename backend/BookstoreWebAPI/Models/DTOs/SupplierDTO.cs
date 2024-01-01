using Newtonsoft.Json;
using BookstoreWebAPI.Models.Shared;
using BookstoreWebAPI.Models.Abstracts;

namespace BookstoreWebAPI.Models.DTOs
{
    public class SupplierDTO : IBaseCosmosDTO
    {
        [JsonProperty("supplierId")]
        public string? SupplierId { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("supplierGroupId")]
        public string? SupplierGroupId { get; set; }

        [JsonProperty("supplierGroupName")]
        public string? SupplierGroupName { get; set; }

        [JsonProperty("contact")]
        public Contact? Contact { get; set; }

        [JsonProperty("address")]
        public string? Address { get; set; }

        [JsonProperty("description")]
        public string? Description { get; set; }

        [JsonProperty("isActive")]
        public bool? IsActive { get; set; }

        [JsonProperty("createdAt")]
        public DateTime CreatedAt { get; set; }
    }
}
