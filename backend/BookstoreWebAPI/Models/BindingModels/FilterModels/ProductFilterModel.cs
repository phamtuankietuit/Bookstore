using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;

namespace BookstoreWebAPI.Models.BindingModels.FilterModels
{
    public class ProductFilterModel
    {
        // my attributes
        private List<(int MinPrice, int MaxPrice)> _priceRanges;
        internal List<(int MinPrice, int MaxPrice)>? PriceRanges { get => _priceRanges; private set { } }

        internal List<string>? Manufacturers { get; set; }
        
        internal List<string>? Authors { get; set; }

        internal List<string>? Publishers { get; set; }

        // query attributes
        
        
        [FromQuery(Name = "categoryIds")]
        [ModelBinder(BinderType = typeof(CommaDelimitedArrayModelBinder<string>))]
        public IEnumerable<string>? CategoryIds { get; set; }

        [FromQuery(Name = "supplierIds")]
        [ModelBinder(BinderType = typeof(CommaDelimitedArrayModelBinder<string>))]
        public IEnumerable<string>? SupplierIds { get; set; }


        private IEnumerable<string>? _priceRangeStrings;
        [FromQuery(Name = "priceRanges")]
        [ModelBinder(BinderType = typeof(CommaDelimitedArrayModelBinder<string>))]
        public IEnumerable<string>? PriceRangeStrings
        {
            get => _priceRangeStrings;
            set
            {
                _priceRangeStrings = value;
                if (_priceRangeStrings == null || !_priceRangeStrings.Any()) { return; }

                _priceRanges = new();

                foreach (var priceRangeString in _priceRangeStrings)
                {
                    var parts = priceRangeString.Split('-');
                    int min = int.Parse(parts[0]);
                    int max = int.Parse(parts[1]);
                    _priceRanges.Add((min, max));
                }

            }
        }

        [FromQuery(Name = "manufacturerIds")]
        [ModelBinder(BinderType = typeof(CommaDelimitedArrayModelBinder<int>))]
        public IEnumerable<int>? ManufacturerIds { get; set; }

        [FromQuery(Name = "authorIds")]
        [ModelBinder(BinderType = typeof(CommaDelimitedArrayModelBinder<int>))]
        public IEnumerable<int>? AuthorIds { get; set; }

        [FromQuery(Name = "publisherIds")]
        [ModelBinder(BinderType = typeof(CommaDelimitedArrayModelBinder<int>))]
        public IEnumerable<int>? PublisherIds { get; set; }

        [FromQuery(Name = "isActives")]
        [ModelBinder(BinderType = typeof(CommaDelimitedArrayModelBinder<string>))]
        public IEnumerable<string>? IsActives { get; set; }
    }
}
