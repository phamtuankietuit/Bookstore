using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.DTOs
{
    public class AdjustmentTicketWithItemsDTO
    {
        public AdjustmentTicketDTO AdjustmentTicketDTO { get; set; }
        public List<AdjustmentItemDTO> AdjustmentItemDTOs { get; set; }
    }
}
