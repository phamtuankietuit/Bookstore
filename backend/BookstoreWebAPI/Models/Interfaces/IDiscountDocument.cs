using BookstoreWebAPI.Models.Shared;
using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.Interfaces
{
    public interface IDiscountDocument
    {
        public List<DiscountItem>? DiscountItems { get; set; }
        public int DiscountRate { get; set; }
        public int DiscountValue { get; set; }
        public int DiscountAmount { get; set; }
    }
}
