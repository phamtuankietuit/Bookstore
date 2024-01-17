using Microsoft.AspNetCore.Mvc;

namespace BookstoreWebAPI.Models.BindingModels
{
    public class QueryParameters
    {
        [FromQuery(Name = "pageSize")]
        public int PageSize { get; set; } = -1;

        [FromQuery(Name = "pageNumber")]
        public int PageNumber { get; set; } = 1;

        [FromQuery(Name = "sortBy")]
        public string SortBy { get; set; } = "createdAt";

        [FromQuery(Name = "orderBy")]
        public string OrderBy { get; set; } = "desc";
    }
}
