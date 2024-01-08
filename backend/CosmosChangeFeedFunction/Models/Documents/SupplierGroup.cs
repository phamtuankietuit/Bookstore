using CosmosChangeFeedFunction.Models.Interfaces;
using Newtonsoft.Json;

namespace CosmosChangeFeedFunction.Models.Documents
{
    public class SupplierGroup : IBaseCosmos, ISoftDeleteCosmos
    {
        
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("supplierGroupId")]
        public string SupplierGroupId { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("numberOfSupplier")]
        public int NumberOfSupplier { get; set; }

        [JsonProperty("note")]
        public string Note { get; set; }

        [JsonProperty("isRemovable")]
        public bool IsRemovable { get; set; }

        [JsonProperty("isDeleted")]
        public bool IsDeleted { get; set; }

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
