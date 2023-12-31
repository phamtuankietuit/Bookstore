﻿using Microsoft.AspNetCore.Mvc;

namespace BookstoreWebAPI.Models.BindingModels.FilterModels
{
    public class CustomerFilterModel : BaseFilterModel
    {
        private bool? _isActive;
        internal bool? IsActive { get => _isActive; private set { } }

        private string? _isActiveString;

        [FromQuery(Name = "isActive")]
        public string? IsActiveString
        {
            get => _isActiveString;
            set
            {
                if (bool.TryParse(value, out bool val))
                {
                    _isActive = val;
                }
                else
                {
                    _isActive = null;
                }
                _isActiveString = value;
            }
        }
    }
}
