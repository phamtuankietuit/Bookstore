using Microsoft.AspNetCore.Mvc;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Repository.Interfaces;
using FluentValidation;
using FluentValidation.Results;
using BookstoreWebAPI.Services;

namespace BookstoreWebAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class SalesOrdersController(
        ISalesOrderRepository salesOrderRepository,
        ILogger<SalesOrdersController> logger,
        IValidator<QueryParameters> validator,
        IValidator<SalesOrderFilterModel> filterModelValidator,
        UserContextService userContextService
    ) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SalesOrderDTO>>> GetSalesOrderDTOsAsync(
            [FromQuery] QueryParameters queryParams,
            [FromQuery] SalesOrderFilterModel filter)
        {
            ValidationResult queryParamResult = await validator.ValidateAsync(queryParams);
            if (!queryParamResult.IsValid) return BadRequest(queryParamResult.Errors);

            ValidationResult filterModelResult = await filterModelValidator.ValidateAsync(filter);
            if (!filterModelResult.IsValid) return BadRequest(filterModelResult.Errors);


            var salesOrders = await salesOrderRepository.GetSalesOrderDTOsAsync(queryParams, filter);
            int totalCount = salesOrderRepository.TotalCount;

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
        
        [HttpGet("{id}")]
        public async Task<ActionResult<SalesOrderDTO>> GetSalesOrderDTOByIdAsync(string id)
        {
            var salesOrder = await salesOrderRepository.GetSalesOrderDTOByIdAsync(id);

            if (salesOrder == null)
            {
                return NotFound();
            }

            return Ok(salesOrder);
        }

        //[HttpGet("today")]
        //public async Task<ActionResult> GetNumberOfOrdersToday()
        //{

        //}


        [HttpPost]
        public async Task<ActionResult> CreateSalesOrderAsync([FromBody] SalesOrderDTO salesOrderDTO)
        {
            var staffId = Request.Headers["staffId"].ToString();
            if (string.IsNullOrEmpty(staffId)) return Unauthorized();
            userContextService.Current.StaffId = staffId;

            try
            {
                var createdSalesOrderDTO = await salesOrderRepository.AddSalesOrderDTOAsync(salesOrderDTO);

                return CreatedAtAction(
                    nameof(GetSalesOrderDTOByIdAsync),
                    new { id = createdSalesOrderDTO.SalesOrderId }, 
                    createdSalesOrderDTO 
                );
            }
            catch (Exception ex)
            {
                logger.LogInformation(
                    $"SalesOrder Name: {salesOrderDTO.CustomerName}" +
                    $"\nError message: {ex.Message}"
                );

                return Conflict(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateSalesOrderAsync(string id, [FromBody] SalesOrderDTO salesOrderDTO)
        {
            var staffId = Request.Headers["staffId"].ToString();
            if (string.IsNullOrEmpty(staffId)) return Unauthorized();
            userContextService.Current.StaffId = staffId;

            if (id != salesOrderDTO.SalesOrderId)
            {
                return BadRequest("Specified id don't match with the DTO.");
            }

            try
            {

                await salesOrderRepository.UpdateSalesOrderDTOAsync(salesOrderDTO);

                return NoContent();
            }
            catch (Exception ex)
            {
                logger.LogError(
                    $"Updating failed. " +
                    $"\nSalesOrder Id: {id}. " +
                    $"\nError message: {ex.Message}");

                return StatusCode(500,
                    $"An error occurred while updating the salesOrder. \n" +
                    $"SalesOrder Id: {id}\n" +
                    $"Error message: {ex.Message}");
            }
        }
    }
}
