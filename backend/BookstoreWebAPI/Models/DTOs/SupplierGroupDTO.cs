using BookstoreWebAPI.Models.Interfaces;
using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.DTOs
{
    public class SupplierGroupDTO : IBaseCosmosDTO
    {
        [JsonProperty("supplierGroupId")]
        public string? SupplierGroupId { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("numberOfSupplier")]
        public int? NumberOfSupplier { get; set; }

        [JsonProperty("note")]
        public string? Note { get; set; }

        [JsonProperty("createdAt")]
        public DateTime? CreatedAt { get; set; }

        [JsonProperty("modifiedAt")]
        public DateTime? ModifiedAt { get; set; }

        [JsonProperty("staffId")]
        public string StaffId { get; set; }
    }
}
