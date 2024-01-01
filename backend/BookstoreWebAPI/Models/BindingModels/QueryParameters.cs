using Microsoft.AspNetCore.Mvc;

namespace BookstoreWebAPI.Models.BindingModels
{
    public class QueryParameters
    {
        [FromQuery(Name = "pageSize")]
        public int PageSize { get; set; }

        [FromQuery(Name ="pageNumber")]
        public int PageNumber { get; set; }

        [FromQuery(Name = "sortBy")]
        public string SortBy { get; set; } = "id";

        [FromQuery(Name = "orderBy")]
        public string OrderBy { get; set; } = "asc";
    }
}
