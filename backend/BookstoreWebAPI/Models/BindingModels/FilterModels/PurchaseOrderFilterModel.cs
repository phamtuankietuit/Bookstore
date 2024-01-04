using Microsoft.AspNetCore.Mvc;

namespace BookstoreWebAPI.Models.BindingModels.FilterModels
{
    public class PurchaseOrderFilterModel
    {
        private DateTime? startDate;
        private DateTime? endDate;

        [FromQuery(Name = "startDate")]
        public DateTime? StartDate
        {
            get => startDate;
            set
            {
                startDate = value;
                if (!endDate.HasValue)
                {
                    endDate = value;
                }
            }
        }

        [FromQuery(Name = "endDate")]
        public DateTime? EndDate
        {
            get => endDate;
            set
            {
                endDate = value;
                if (!startDate.HasValue)
                {
                    startDate = value;
                }
            }
        }

        [FromQuery(Name = "supplierIds")]
        [ModelBinder(BinderType = typeof(CommaDelimitedArrayModelBinder<string>))]
        public IEnumerable<string>? SupplierIds { get; set; }

        
        private bool? _isPaidOrder;
        internal bool? IsPaidOrder { get => _isPaidOrder; private set { } }

        private string? _isPaidOrderString;

        [FromQuery(Name = "isPaidOrder")]
        public string? IsPaidOrderString
        {
            get => _isPaidOrderString;
            set
            {
                if (bool.TryParse(value, out bool val))
                {
                    _isPaidOrder = val;
                }
                else
                {
                    _isPaidOrder = null;
                }
                _isPaidOrderString = value;
            }
        }
    }
}
