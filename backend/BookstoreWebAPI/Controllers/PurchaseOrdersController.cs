using Microsoft.AspNetCore.Mvc;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Repository.Interfaces;
using FluentValidation;
using FluentValidation.Results;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookstoreWebAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class PurchaseOrdersController(
        ILogger<PurchaseOrdersController> logger,
        IPurchaseOrderRepository purchaseOrderRepository,
        IValidator<QueryParameters> validator,
        IValidator<PurchaseOrderFilterModel> purchaseOrderFilterValidator
    ) : ControllerBase
    {

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PurchaseOrderDTO>>> GetPurchaseOrderDTOsAsync(
            [FromQuery] QueryParameters queryParams,
            [FromQuery] PurchaseOrderFilterModel filter)
        {
            ValidationResult queryParamResult = await validator.ValidateAsync(queryParams);
            if (!queryParamResult.IsValid) return BadRequest(queryParamResult.Errors);

            ValidationResult filterModelResult = await purchaseOrderFilterValidator.ValidateAsync(filter);
            if (!filterModelResult.IsValid) return BadRequest(filterModelResult.Errors);

            var purchaseOrders = await purchaseOrderRepository.GetPurchaseOrderDTOsAsync(queryParams, filter);
            int totalCount = purchaseOrderRepository.TotalCount;

            if (purchaseOrders == null || !purchaseOrders.Any())
            {
                return NotFound();
            }

            return Ok(new
            {
                data = purchaseOrders,
                metadata = new
                {
                    count = totalCount
                }
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PurchaseOrderDTO>> GetPurchaseOrderDTOByIdAsync(string id)
        {
            var purchaseOrder = await purchaseOrderRepository.GetPurchaseOrderDTOByIdAsync(id);

            if (purchaseOrder == null)
            {
                return NotFound();
            }

            return Ok(purchaseOrder);
        }

        [HttpPost]
        public async Task<ActionResult> CreatePurchaseOrderAsync([FromBody] PurchaseOrderDTO purchaseOrderDTO)
        {
            try
            {
                var createdPurchaseOrder = await purchaseOrderRepository.AddPurchaseOrderDTOAsync(purchaseOrderDTO);

                return CreatedAtAction(
                    nameof(GetPurchaseOrderDTOByIdAsync),
                    new { id = createdPurchaseOrder.PurchaseOrderId},
                    createdPurchaseOrder
                );
            }
            catch (Exception ex)
            {
                logger.LogInformation(
                    $"Supplier id at purchase order: {purchaseOrderDTO.SupplierName}" +
                    $"\nError message: {ex.Message}"
                );

                return Conflict(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdatePurchaseOrderAsync(string id, [FromBody] PurchaseOrderDTO purchaseOrderDTO)
        {

            if (id != purchaseOrderDTO.PurchaseOrderId)
            {
                return BadRequest("Specified id don't match with the DTO.");
            }

            try
            {
                await purchaseOrderRepository.UpdatePurchaseOrderAsync(purchaseOrderDTO);

                return NoContent();
            }
            catch (Exception ex)
            {
                logger.LogError(
                    $"Updating failed. " +
                    $"\nPurchaseOrder Id: {id}. " +
                    $"\nError message: {ex.Message}");

                return StatusCode(500,
                    $"An error occurred while updating the purchase order. \n" +
                    $"PurchaseOrder Id: {id}\n" +
                    $"Error message: {ex.Message}");
            }
        }
    }
}
