using Microsoft.AspNetCore.Mvc;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Repository.Interfaces;
using System.Drawing.Printing;
using BookstoreWebAPI.Models.BindingModels;
using FluentValidation;
using FluentValidation.Results;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using Microsoft.AspNetCore.Authorization;
using BookstoreWebAPI.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookstoreWebAPI.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly ILogger<CustomersController> _logger;
        private readonly ICustomerRepository _customerRepository;
        private readonly IValidator<QueryParameters> _queryParametersValidator;
        private readonly IValidator<CustomerFilterModel> _filterValidator;
        private readonly UserContextService _userContextService;

        public CustomersController(
            ILogger<CustomersController> logger,
            ICustomerRepository customerRepository,
            IValidator<QueryParameters> validator,
            IValidator<CustomerFilterModel> filterModelValidator,
            UserContextService userContextService)
        {
            _logger = logger;
            _customerRepository = customerRepository;
            _queryParametersValidator = validator;
            _filterValidator = filterModelValidator;
            _userContextService = userContextService;
        }

        // GET: api/<CustomersController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerDTO>>> GetCustomerDTOsAsync(
            [FromQuery] QueryParameters queryParams, 
            [FromQuery] CustomerFilterModel filter
        )
        {
            ValidationResult queryParamResult = await _queryParametersValidator.ValidateAsync(queryParams);
            if (!queryParamResult.IsValid) return BadRequest(queryParamResult.Errors);

            ValidationResult filterModelResult = await _filterValidator.ValidateAsync(filter);
            if (!filterModelResult.IsValid) return BadRequest(filterModelResult.Errors);

            var customers = await _customerRepository.GetCustomerDTOsAsync(queryParams, filter);
            int totalCount = _customerRepository.TotalCount;

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

        // GET api/<CustomersController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CustomerDTO>> GetCustomerDTOByIdAsync(string id)
        {
            var customer = await _customerRepository.GetCustomerDTOByIdAsync(id);

            if (customer == null)
            {
                return NotFound();
            }

            return Ok(customer);
        }

        // POST api/<CustomersController>
        [HttpPost]
        public async Task<ActionResult> CreateCustomerAsync([FromBody] CustomerDTO customerDTO)
        {
            var staffId = Request.Headers["staffId"].ToString();
            if (staffId == null) return Unauthorized();
            _userContextService.Current.StaffId = staffId;

            try
            {
                var createdCustomerDTO = await _customerRepository.AddCustomerDTOAsync(customerDTO);

                return CreatedAtAction(
                    nameof(GetCustomerDTOByIdAsync), // method
                    new { id = createdCustomerDTO.CustomerId }, // param in method
                    createdCustomerDTO // values returning after the route
                );
            }
            catch (Exception ex)
            {
                _logger.LogInformation(
                    $"Customer Name: {customerDTO.Name}" +
                    $"\nError message: {ex.Message}"
                );

                return Conflict(ex.Message);
            }
        }

        // PUT api/<CustomersController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCustomerAsync(string id, [FromBody] CustomerDTO customerDTO)
        {
            var staffId = Request.Headers["staffId"].ToString();
            if (staffId == null) return Unauthorized();
            _userContextService.Current.StaffId = staffId;

            if (id != customerDTO.CustomerId)
            {
                return BadRequest("Specified id don't match with the DTO.");
            }

            try
            {

                await _customerRepository.UpdateCustomerDTOAsync(customerDTO);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(
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
            if (staffId == null) return Unauthorized();
            _userContextService.Current.StaffId = staffId;

            if (ids == null || !ids.Any())
            {
                return BadRequest("ids is required.");
            }

            var result = await _customerRepository.DeleteCustomerDTOsAsync(ids);

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

