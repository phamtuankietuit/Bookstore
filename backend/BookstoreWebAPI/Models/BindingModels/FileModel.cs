using Microsoft.AspNetCore.Mvc;

namespace BookstoreWebAPI.Models.BindingModels
{
    public class FileModel
    {
        public IFormFile ImageFiles { get; set; }

        internal string Url { get; set; }
        //public string? Base64 { get; set; }
    }
}
