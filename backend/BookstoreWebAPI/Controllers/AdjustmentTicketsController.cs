using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Repository.Interfaces;
using BookstoreWebAPI.Services;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1.IsisMtt.X509;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookstoreWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdjustmentTicketsController(
        ILogger<AdjustmentTicketsController> logger,
        IAdjustmentItemRepository adjustmentItemRepository,
        IAdjustmentTicketRepository adjustmentTicketRepository,
        UserContextService userContextService
    ) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<AdjustmentTicketDTO>> GetAdjustmentTicketDTOsAsync(QueryParameters queryParams, AdjustmentTicketFilterModel filter)
        {
            var result = await adjustmentTicketRepository.GetAdjustmentTicketDTOsAsync(queryParams, filter);
            var totalCount = adjustmentTicketRepository.TotalCount;

            if (result == null || !result.Any())
            {
                return NotFound();
            }

            return Ok(new
            {
                data = result,
                metadata = new
                {
                    count = totalCount
                }
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AdjustmentTicketWithItemsDTO>> GetAdjustmentTicketDetailsByIdAsync(string id)
        {
            var ticket = await adjustmentTicketRepository.GetAdjustmentTicketDTOByIdAsync(id);
            var items = await adjustmentItemRepository.GetAdjustmentItemsByTicketIdAsync(id);

            if (ticket == null || items == null || !items.Any())
            {
                return NotFound();
            }

            var result = new AdjustmentTicketWithItemsDTO()
            {
                AdjustmentTicketDTO = ticket,
                AdjustmentItemDTOs = items.ToList()
            };

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<AdjustmentTicketWithItemsDTO>> AddAdjustmentTicketWithItemsDTOAsync([FromBody]AdjustmentTicketWithItemsDTO itemsDTO)
        {
            var staffId = Request.Headers["staffId"].ToString();
            if (string.IsNullOrEmpty(staffId)) return Unauthorized();
            userContextService.Current.StaffId = staffId;

            try
            {
                var ticket = itemsDTO.AdjustmentTicketDTO;
                var items = itemsDTO.AdjustmentItemDTOs;

                var createdTicket = await adjustmentTicketRepository.AddAdjustmentTicketDTOAsync(ticket);

                List<AdjustmentItemDTO> createdItems = [];

                foreach (var item in items)
                {
                    var createdItem = await adjustmentItemRepository.AddAdjustmentItemDTOAsync(item, createdTicket.AdjustmentTicketId);
                    createdItems.Add(createdItem);
                }

                var result = new AdjustmentTicketWithItemsDTO()
                {
                    AdjustmentTicketDTO = createdTicket,
                    AdjustmentItemDTOs = createdItems.ToList()
                };

                return CreatedAtAction(
                    nameof(GetAdjustmentTicketDetailsByIdAsync),
                    new { id = createdTicket.AdjustmentTicketId},
                    result);
            }
            catch(Exception ex)
            {

                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateAdjustmentTicketWithItemsDTOAsync(string id, [FromBody]AdjustmentTicketWithItemsDTO itemDTO)
        {
            var staffId = Request.Headers["staffId"].ToString();
            if (string.IsNullOrEmpty(staffId)) return Unauthorized();
            userContextService.Current.StaffId = staffId;

            if (id != itemDTO.AdjustmentTicketDTO.AdjustmentTicketId)
            {
                return BadRequest("id didn't match");
            }

            try
            {
                var ticket = itemDTO.AdjustmentTicketDTO;
                var items = itemDTO.AdjustmentItemDTOs;

                await adjustmentTicketRepository.UpdateAdjustmentTicketDTOAsync(ticket);
                await adjustmentItemRepository.UpdateListAdjustmentItemDTOsAsync(items);


                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
