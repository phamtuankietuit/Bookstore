using Microsoft.AspNetCore.Mvc;

namespace BookstoreWebAPI.Models.BindingModels.FilterModels
{
    public class SupplierFilterModel
    {
        [FromQuery(Name = "supplierGroupId")]
        public string? SupplierGroupId { get; set; }

        [FromQuery(Name = "isActive")]
        public string? IsActive { get; set; }
    }
}
