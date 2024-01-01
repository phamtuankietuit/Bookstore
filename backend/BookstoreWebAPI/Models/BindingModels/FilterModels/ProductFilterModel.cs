using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;

namespace BookstoreWebAPI.Models.BindingModels.FilterModels
{
    public class ProductFilterModel
    {
        [FromQuery(Name = "categoryId")]
        public string? CategoryId { get; set; }

        private string? _priceRangeString;

        [FromQuery(Name = "priceRange")]
        public string? PriceRangeString
        {
            get => _priceRangeString;
            set
            {
                _priceRangeString = value;
                if (_priceRangeString == null || string.IsNullOrEmpty(_priceRangeString)) { return; }


                var parts = _priceRangeString.Split('-');
                int min = int.Parse(parts[0]);
                int max = int.Parse(parts[1]);

                _priceRange = (min, max);
            }
        }

        [FromQuery(Name = "manufacturerId")]
        public int ManufacturerId { get; set; } = -1;

        [FromQuery(Name = "supplierId")]
        public int SupplierId { get; set; } = -1;

        [FromQuery(Name = "authorId")]
        public int AuthorId { get; set; } = -1;

        [FromQuery(Name = "publisherId")]
        public int PublisherId { get; set; } = -1;
        [FromQuery(Name = "isActive")]
        public string? IsActive { get; set; }


        private (int MinPrice, int MaxPrice) _priceRange;
        public (int MinPrice, int MaxPrice) PriceRange { get => _priceRange; private set { } }


        [OpenApiIgnore]
        public string? Manufacturer { get; private set; }

        [OpenApiIgnore]
        public string? SupplierName { get; private set; }

        [OpenApiIgnore]
        public string? Author { get; private set; }

        [OpenApiIgnore]
        public string? Publisher { get; private set; }

        public void setManufacturer(string newManufacturer) { Manufacturer = newManufacturer; }
        public void setSupplierName(string newSupplierName) { SupplierName = newSupplierName; }
        public void setAuthor(string newAuthor) { Author = newAuthor; }
        public void setPublisher(string newPublisher) { Publisher = newPublisher; }
    }
}
