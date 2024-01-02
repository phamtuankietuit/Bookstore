using Microsoft.AspNetCore.Mvc;

namespace BookstoreWebAPI.Models.BindingModels.FilterModels
{
    public class SupplierFilterModel
    {
        [FromQuery(Name = "supplierGroupId")]
        [ModelBinder(BinderType = typeof(CommaDelimitedArrayModelBinder<string>))]
        public IEnumerable<string>? SupplierGroupIds { get; set; }

        [FromQuery(Name = "isActive")]
        [ModelBinder(BinderType = typeof(CommaDelimitedArrayModelBinder<string>))]
        public IEnumerable<string>? IsActives { get; set; }
    }
}
