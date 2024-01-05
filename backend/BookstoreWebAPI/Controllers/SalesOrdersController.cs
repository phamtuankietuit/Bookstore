using Microsoft.AspNetCore.Mvc;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Repository.Interfaces;
using BookstoreWebAPI.Models.BindingModels;
using FluentValidation;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using FluentValidation.Results;
using BookstoreWebAPI.Repository;
using Microsoft.AspNetCore.Authorization;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookstoreWebAPI.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class SalesOrdersController : ControllerBase
    {
        private readonly ISalesOrderRepository _salesOrderRepository;
        private readonly ILogger<SalesOrdersController> _logger;
        private readonly IValidator<QueryParameters> _queryParametersValidator;
        private readonly IValidator<SalesOrderFilterModel> _filterValidator;

        public SalesOrdersController(
            ISalesOrderRepository salesOrderRepository,
            ILogger<SalesOrdersController> logger,
            IValidator<QueryParameters> validator,
            IValidator<SalesOrderFilterModel> filterModelValidator)
        {
            _salesOrderRepository = salesOrderRepository;
            _logger = logger;
            _queryParametersValidator = validator;
            _filterValidator = filterModelValidator;
        }

        // GET: api/<SalesOrdersController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SalesOrderDTO>>> GetSalesOrderDTOsAsync(
            [FromQuery] QueryParameters queryParams,
            [FromQuery] SalesOrderFilterModel filter)
        {
            ValidationResult queryParamResult = await _queryParametersValidator.ValidateAsync(queryParams);
            if (!queryParamResult.IsValid) return BadRequest(queryParamResult.Errors);

            ValidationResult filterModelResult = await _filterValidator.ValidateAsync(filter);
            if (!filterModelResult.IsValid) return BadRequest(filterModelResult.Errors);


            int totalCount = await _salesOrderRepository.GetTotalCount(queryParams, filter);
            var salesOrders = await _salesOrderRepository.GetSalesOrderDTOsAsync(queryParams, filter);

            if (salesOrders == null || !salesOrders.Any())
            {
                return NotFound();
            }

            return Ok(new
            {
                data = salesOrders,
                metadata = new
                {
                    count = totalCount
                }
            });
        }
        
        // GET api/<SalesOrdersController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SalesOrderDTO>> GetSalesOrderDTOByIdAsync(string id)
        {
            var salesOrder = await _salesOrderRepository.GetSalesOrderDTOByIdAsync(id);

            if (salesOrder == null)
            {
                return NotFound();
            }

            return Ok(salesOrder);
        }

        // POST api/<SalesOrdersController>
        [HttpPost]
        public async Task<ActionResult> CreateSalesOrderAsync([FromBody] SalesOrderDTO salesOrderDTO)
        {
            try
            {
                var createdSalesOrderDTO = await _salesOrderRepository.AddSalesOrderDTOAsync(salesOrderDTO);

                return CreatedAtAction(
                    nameof(GetSalesOrderDTOByIdAsync), // method
                    new { id = createdSalesOrderDTO.SalesOrderId }, // param in method
                    createdSalesOrderDTO // values returning after the route
                );
            }
            catch (Exception ex)
            {
                _logger.LogInformation(
                    $"SalesOrder Name: {salesOrderDTO.CustomerName}" +
                    $"\nError message: {ex.Message}"
                );

                return Conflict(ex.Message);
            }
        }

        // PUT api/<SalesOrdersController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateSalesOrderAsync(string id, [FromBody] SalesOrderDTO salesOrderDTO)
        {
            if (id != salesOrderDTO.SalesOrderId)
            {
                return BadRequest("Specified id don't match with the DTO.");
            }

            try
            {

                await _salesOrderRepository.UpdateSalesOrderDTOAsync(salesOrderDTO);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Updating failed. " +
                    $"\nSalesOrder Id: {id}. " +
                    $"\nError message: {ex.Message}");

                return StatusCode(500,
                    $"An error occurred while updating the salesOrder. \n" +
                    $"SalesOrder Id: {id}\n" +
                    $"Error message: {ex.Message}");
            }
        }

        // - no support
        // DELETE api/<SalesOrdersController>/5
        //[HttpDelete("{id}")]
        //public async Task<ActionResult> DeleteSalesOrderAsync(string id)
        //{
        //    try
        //    {
        //        await _salesOrderRepository.DeleteSalesOrderAsync(id);

        //        return Ok("SalesOrder updated successfully.");
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogInformation($"Error message: {ex.Message}");
        //        return StatusCode(500, $"An error occurred while creating the salesOrder. OrderId: {id}");
        //    }
        //}
    }
}
