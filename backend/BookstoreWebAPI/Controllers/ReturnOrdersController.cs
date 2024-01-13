using Microsoft.AspNetCore.Mvc;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Repository.Interfaces;
using FluentValidation;
using FluentValidation.Results;
using BookstoreWebAPI.Services;
using BookstoreWebAPI.Exceptions;

namespace BookstoreWebAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ReturnOrdersController(
        IReturnOrderRepository returnOrderRepository,
        ILogger<ReturnOrdersController> logger,
        IValidator<QueryParameters> validator,
        IValidator<ReturnOrderFilterModel> filterModelValidator,
        UserContextService userContextService
    ) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReturnOrderDTO>>> GetReturnOrderDTOsAsync(
            [FromQuery] QueryParameters queryParams,
            [FromQuery] ReturnOrderFilterModel filter)
        {
            ValidationResult queryParamResult = await validator.ValidateAsync(queryParams);
            if (!queryParamResult.IsValid) return BadRequest(queryParamResult.Errors);

            ValidationResult filterModelResult = await filterModelValidator.ValidateAsync(filter);
            if (!filterModelResult.IsValid) return BadRequest(filterModelResult.Errors);


            var returnOrders = await returnOrderRepository.GetReturnOrderDTOsAsync(queryParams, filter);
            int totalCount = returnOrderRepository.TotalCount;

            if (returnOrders == null || !returnOrders.Any())
            {
                return NotFound();
            }

            return Ok(new
            {
                data = returnOrders,
                metadata = new
                {
                    count = totalCount
                }
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReturnOrderDTO>> GetReturnOrderDTOByIdAsync(string id)
        {
            var returnOrder = await returnOrderRepository.GetReturnOrderDTOByIdAsync(id);

            if (returnOrder == null)
            {
                return NotFound();
            }

            return Ok(returnOrder);
        }

        [HttpGet("init/{salesOrderId}")]
        public async Task<ActionResult<ReturnOrderDTO>> GetInitReturnOrder(string salesOrderId)
        {
            var staffId = Request.Headers["staffId"].ToString();
            if (string.IsNullOrEmpty(staffId)) return Unauthorized();
            userContextService.Current.StaffId = staffId;


            try
            {
                var initReturnOrder = await returnOrderRepository.GetInitReturnOrderDTO(salesOrderId);

                if (initReturnOrder == null)
                {
                    return NotFound();
                }

                return Ok(initReturnOrder);
            }
            catch (OrderReturnNotAllowedException)
            {
                return StatusCode(403, "This order can't be returned anymore");
            }
            catch (TrackingAccountNotFoundException)
            {
                return BadRequest("Invalid staffId");
            }
            catch (Exception ex) 
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult> CreateReturnOrderAsync([FromBody] ReturnOrderDTO returnOrderDTO)
        {
            var staffId = Request.Headers["staffId"].ToString();
            if (string.IsNullOrEmpty(staffId)) return Unauthorized();
            userContextService.Current.StaffId = staffId;

            try
            {
                var createdReturnOrderDTO = await returnOrderRepository.AddReturnOrderDTOAsync(returnOrderDTO);

                return CreatedAtAction(
                    nameof(GetReturnOrderDTOByIdAsync),
                    new { id = createdReturnOrderDTO.ReturnOrderId },
                    createdReturnOrderDTO
                );
            }
            catch (Exception ex)
            {
                logger.LogInformation(
                    $"ReturnOrder Name: {returnOrderDTO.CustomerName}" +
                    $"\nError message: {ex.Message}"
                );

                return Conflict(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateReturnOrderAsync(string id, [FromBody] ReturnOrderDTO returnOrderDTO)
        {
            var staffId = Request.Headers["staffId"].ToString();
            if (string.IsNullOrEmpty(staffId)) return Unauthorized();
            userContextService.Current.StaffId = staffId;

            if (id != returnOrderDTO.ReturnOrderId)
            {
                return BadRequest("Specified id don't match with the DTO.");
            }

            try
            {

                await returnOrderRepository.UpdateReturnOrderDTOAsync(returnOrderDTO);

                return NoContent();
            }
            catch (Exception ex)
            {
                logger.LogError(
                    $"Updating failed. " +
                    $"\nReturnOrder Id: {id}. " +
                    $"\nError message: {ex.Message}");

                return StatusCode(500,
                    $"An error occurred while updating the returnOrder. \n" +
                    $"ReturnOrder Id: {id}\n" +
                    $"Error message: {ex.Message}");
            }
        }
    }
}
