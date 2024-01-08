using Microsoft.AspNetCore.Mvc;

namespace BookstoreWebAPI.Models.BindingModels.FilterModels
{
    public abstract class BaseFilterModel
    {
        [FromQuery(Name = "query")]
        public string? Query { get; set; }
    }
}
