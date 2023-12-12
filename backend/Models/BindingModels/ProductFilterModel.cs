using Microsoft.AspNetCore.Mvc;

namespace SE100_BookstoreWebAPI.Models.BindingModels
{
    public class ProductFilterModel
    {
        [FromQuery(Name = "order")]
        public string Order { get; set; }
        public int? Limit { get; set; }
        public int? Page { get; set; }
        public (decimal MinPrice, decimal MaxPrice)? PriceRange { get; set; }
        public int? ManufacturerId { get; set; }
        public List<int> SupplierList { get; set; }
        public List<int> ProductionPlaces { get; set; }
        public List<int> Origins { get; set; }
        public List<int> Colors { get; set; }
        public List<int> InkColors { get; set; }

        // Additional methods to parse and validate individual filter components
    }
}
