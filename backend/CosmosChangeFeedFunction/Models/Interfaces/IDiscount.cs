using CosmosChangeFeedFunction.Models.Documentshared;
using Newtonsoft.Json;

namespace CosmosChangeFeedFunction.Models.Interfaces
{
    public interface IDiscount
    {
        public List<DiscountItem>? DiscountItems { get; set; }
        public int DiscountRate { get; set; }
        public int DiscountValue { get; set; }
        public int DiscountAmount { get; set; }
    }
}
