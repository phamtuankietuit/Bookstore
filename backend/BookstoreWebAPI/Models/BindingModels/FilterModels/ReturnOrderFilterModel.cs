﻿using Microsoft.AspNetCore.Mvc;

namespace BookstoreWebAPI.Models.BindingModels.FilterModels
{
    public class ReturnOrderFilterModel : BaseFilterModel
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

        [FromQuery(Name = "staffIds")]
        [ModelBinder(BinderType = typeof(CommaDelimitedArrayModelBinder<string>))]
        public IEnumerable<string>? StaffIds { get; set; }


        [FromQuery(Name = "salesOrderIds")]
        [ModelBinder(BinderType = typeof(CommaDelimitedArrayModelBinder<string>))]
        public IEnumerable<string>? SalesOrderIds { get; set; }
    }
}
