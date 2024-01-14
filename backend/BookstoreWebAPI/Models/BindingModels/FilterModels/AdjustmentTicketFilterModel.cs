using Microsoft.AspNetCore.Mvc;

namespace BookstoreWebAPI.Models.BindingModels.FilterModels
{
    public class AdjustmentTicketFilterModel
    {
        [FromQuery(Name = "statuses")]
        [ModelBinder(BinderType = typeof(CommaDelimitedArrayModelBinder<string>))]
        public IEnumerable<string>? Statuses { get; set; }

    }
}
