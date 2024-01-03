using Microsoft.AspNetCore.Mvc;

namespace BookstoreWebAPI.Models.BindingModels.FilterModels
{
    public class PromotionFilterModel
    {
        private bool? _isOutdated;

        internal bool? IsOutdated { get => _isOutdated; private set { } }

        [FromQuery(Name = "isOutdated")]
        public string? IsOutdatedString
        { 
            get => _isOutdated.ToString(); 
            set
            {
                if (bool.TryParse(value, out bool val))
                    _isOutdated = val;
                else
                    _isOutdated = null;
            }
        }

        [FromQuery(Name = "salesOrderPrice")]
        public int? SalesOrderPrice { get; set; }

        [FromQuery(Name = "statuses")]
        [ModelBinder(BinderType = typeof(CommaDelimitedArrayModelBinder<string>))]
        public IEnumerable<string>? Statuses { get; set; }


    }
}
