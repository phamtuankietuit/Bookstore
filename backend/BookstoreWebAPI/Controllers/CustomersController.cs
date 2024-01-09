using Microsoft.AspNetCore.Mvc;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Repository.Interfaces;
using BookstoreWebAPI.Services;
using FluentValidation;
using FluentValidation.Results;

namespace BookstoreWebAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController(
        ILogger<CustomersController> logger,
        ICustomerRepository customerRepository,
        IValidator<QueryParameters> validator,
        IValidator<CustomerFilterModel> filterModelValidator,
        UserContextService userContextService
    ) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerDTO>>> GetCustomerDTOsAsync(
            [FromQuery] QueryParameters queryParams, 
            [FromQuery] CustomerFilterModel filter
        )
        {
            ValidationResult queryParamResult = await validator.ValidateAsync(queryParams);
            if (!queryParamResult.IsValid) return BadRequest(queryParamResult.Errors);

            ValidationResult filterModelResult = await filterModelValidator.ValidateAsync(filter);
            if (!filterModelResult.IsValid) return BadRequest(filterModelResult.Errors);

            var customers = await customerRepository.GetCustomerDTOsAsync(queryParams, filter);
            int totalCount = customerRepository.TotalCount;

            if (customers == null || !customers.Any())
            {
                return NotFound();
            }

            return Ok(new
            {
                data = customers,
                metadata = new
                {
                    count = totalCount
                }
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CustomerDTO>> GetCustomerDTOByIdAsync(string id)
        {
            var customer = await customerRepository.GetCustomerDTOByIdAsync(id);

            if (customer == null)
            {
                return NotFound();
            }

            return Ok(customer);
        }

        [HttpPost]
        public async Task<ActionResult> CreateCustomerAsync([FromBody] CustomerDTO customerDTO)
        {
            var staffId = Request.Headers["staffId"].ToString();
            if (string.IsNullOrEmpty(staffId)) return Unauthorized();
            userContextService.Current.StaffId = staffId;

            try
            {
                var createdCustomerDTO = await customerRepository.AddCustomerDTOAsync(customerDTO);

                return CreatedAtAction(
                    nameof(GetCustomerDTOByIdAsync), 
                    new { id = createdCustomerDTO.CustomerId }, 
                    createdCustomerDTO 
                );
            }
            catch (Exception ex)
            {
                logger.LogInformation(
                    $"Customer Name: {customerDTO.Name}" +
                    $"\nError message: {ex.Message}"
                );

                return Conflict(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCustomerAsync(string id, [FromBody] CustomerDTO customerDTO)
        {
            var staffId = Request.Headers["staffId"].ToString();
            if (string.IsNullOrEmpty(staffId)) return Unauthorized();
            userContextService.Current.StaffId = staffId;

            if (id != customerDTO.CustomerId)
            {
                return BadRequest("Specified id don't match with the DTO.");
            }

            try
            {

                await customerRepository.UpdateCustomerDTOAsync(customerDTO);

                return NoContent();
            }
            catch (Exception ex)
            {
                logger.LogError(
                    $"Updating failed. " +
                    $"\nCustomer Id: {id}. " +
                    $"\nError message: {ex.Message}");

                return StatusCode(500,
                    $"An error occurred while updating the customer. \n" +
                    $"Customer Id: {id}\n" +
                    $"Error message: {ex.Message}");
            }
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteCustomersAsync([FromQuery] string[] ids)
        {
            var staffId = Request.Headers["staffId"].ToString();
            if (string.IsNullOrEmpty(staffId)) return Unauthorized();
            userContextService.Current.StaffId = staffId;

            if (ids == null || ids.Length == 0)
            {
                return BadRequest("ids is required.");
            }

            var result = await customerRepository.DeleteCustomerDTOsAsync(ids);

            int statusCount = 0;
            if (!result.IsNotSuccessful) statusCount++;
            if (!result.IsFound) statusCount++;
            if (!result.IsNotForbidden) statusCount++;

            if (statusCount > 1)
                return StatusCode(207, result.Responses);
            else if (!result.IsNotSuccessful) return NoContent();
            else if (!result.IsFound) return NotFound();

            return StatusCode(403);
        }
    }
}

