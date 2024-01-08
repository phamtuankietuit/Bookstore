using BookstoreWebAPI.Models.Shared;

namespace BookstoreWebAPI.Models.Interfaces
{
    public interface IDiscountDTO
    {
        public List<DiscountItem>? DiscountItems { get; set; }
        public int DiscountRate { get; set; }
        public int DiscountValue { get; set; }
        public int DiscountAmount { get; set; }
    }
}
