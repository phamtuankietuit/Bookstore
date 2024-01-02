using Microsoft.AspNetCore.Mvc;

namespace BookstoreWebAPI.Models.BindingModels.FilterModels
{
    public class PurchaseOrderFilterModel
    {
        [FromQuery(Name = "supplierIds")]
        [ModelBinder(BinderType = typeof(CommaDelimitedArrayModelBinder<string>))]
        public IEnumerable<string>? SupplierIds { get; set; }


    }
}
