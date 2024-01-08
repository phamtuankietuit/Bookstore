using Microsoft.AspNetCore.Mvc;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Repository.Interfaces;
using FluentValidation;
using BookstoreWebAPI.Models.BindingModels;
using FluentValidation.Results;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using Microsoft.AspNetCore.Authorization;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookstoreWebAPI.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class PurchaseOrdersController : ControllerBase
    {
        private readonly ILogger<PurchaseOrdersController> _logger;
        private readonly IPurchaseOrderRepository _purchaseOrderRepository;
        private readonly IValidator<QueryParameters> _queryParametersValidator;
        private readonly IValidator<PurchaseOrderFilterModel> _filterValidator;
        public PurchaseOrdersController(
            ILogger<PurchaseOrdersController> logger,
            IPurchaseOrderRepository purchaseOrderRepository,
            IValidator<QueryParameters> validator,
            IValidator<PurchaseOrderFilterModel> purchaseOrderFilterValidator)
        {
            _logger = logger;
            _purchaseOrderRepository = purchaseOrderRepository;
            _queryParametersValidator = validator;
            _filterValidator = purchaseOrderFilterValidator;
        }

        // GET: api/<PurchaseOrdersController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PurchaseOrderDTO>>> GetPurchaseOrderDTOsAsync(
            [FromQuery] QueryParameters queryParams,
            [FromQuery] PurchaseOrderFilterModel filter)
        {
            ValidationResult queryParamResult = await _queryParametersValidator.ValidateAsync(queryParams);
            if (!queryParamResult.IsValid) return BadRequest(queryParamResult.Errors);

            ValidationResult filterModelResult = await _filterValidator.ValidateAsync(filter);
            if (!filterModelResult.IsValid) return BadRequest(filterModelResult.Errors);

            var purchaseOrders = await _purchaseOrderRepository.GetPurchaseOrderDTOsAsync(queryParams, filter);
            int totalCount = _purchaseOrderRepository.TotalCount;

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

        // GET api/<PurchaseOrdersController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PurchaseOrderDTO>> GetPurchaseOrderDTOByIdAsync(string id)
        {
            var purchaseOrder = await _purchaseOrderRepository.GetPurchaseOrderDTOByIdAsync(id);

            if (purchaseOrder == null)
            {
                return NotFound();
            }

            return Ok(purchaseOrder);
        }

        // POST api/<PurchaseOrdersController>
        [HttpPost]
        public async Task<ActionResult> CreatePurchaseOrderAsync([FromBody] PurchaseOrderDTO purchaseOrderDTO)
        {
            try
            {
                var createdPurchaseOrder = await _purchaseOrderRepository.AddPurchaseOrderDTOAsync(purchaseOrderDTO);

                return CreatedAtAction(
                    nameof(GetPurchaseOrderDTOByIdAsync),
                    new { id = createdPurchaseOrder.PurchaseOrderId},
                    createdPurchaseOrder
                );
            }
            catch (Exception ex)
            {
                _logger.LogInformation(
                    $"Supplier id at purchase order: {purchaseOrderDTO.SupplierName}" +
                    $"\nError message: {ex.Message}"
                );

                return Conflict(ex.Message);
            }
        }

        // PUT api/<PurchaseOrdersController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdatePurchaseOrderAsync(string id, [FromBody] PurchaseOrderDTO purchaseOrderDTO)
        {

            if (id != purchaseOrderDTO.PurchaseOrderId)
            {
                return BadRequest("Specified id don't match with the DTO.");
            }

            try
            {
                await _purchaseOrderRepository.UpdatePurchaseOrderAsync(purchaseOrderDTO);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Updating failed. " +
                    $"\nPurchaseOrder Id: {id}. " +
                    $"\nError message: {ex.Message}");

                return StatusCode(500,
                    $"An error occurred while updating the purchase order. \n" +
                    $"PurchaseOrder Id: {id}\n" +
                    $"Error message: {ex.Message}");
            }
        }

        // no -support
        // DELETE api/<PurchaseOrdersController>/5
        //[HttpDelete("{id}")]
        //public async Task<ActionResult> DeletePurchaseOrderAsync(string id)
        //{
        //    try
        //    {
        //        await _purchaseOrderRepository.DeletePurchaseOrderAsync(id);

        //        return Ok("PurchaseOrder updated successfully.");
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogInformation($"Error message: {ex.Message}");
        //        return StatusCode(500, $"An error occurred while creating the purchaseOrder. PurchaseOrderId: {id}");
        //    }
        //}
    }
}
