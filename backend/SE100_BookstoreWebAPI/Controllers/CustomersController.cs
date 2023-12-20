using Microsoft.AspNetCore.Mvc;
using SE100_BookstoreWebAPI.Models.DTOs;
using SE100_BookstoreWebAPI.Repository.Interfaces;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SE100_BookstoreWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly ILogger<CustomersController> _logger;
        private readonly ICustomerRepository _customerRepository;

        public CustomersController(ILogger<CustomersController> logger, ICustomerRepository customerRepository)
        {
            _logger = logger;
            _customerRepository = customerRepository;
        }

        // GET: api/<CustomersController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerDTO>>> GetCustomerDTOsAsync()
        {
            var customers = await _customerRepository.GetCustomerDTOsAsync();

            if (customers == null || !customers.Any())
            {
                return NotFound();
            }

            return Ok(customers);
        }

        [HttpGet("newId")]
        public async Task<ActionResult<string>> GetNewCustomerIdAsync()
        {
            string newId = await _customerRepository.GetNewCustomerIdAsync();

            return Ok(newId);
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
            try
            {
                await _customerRepository.AddCustomerDTOAsync(customerDTO);

                return Ok("Customer created successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogInformation($"Error message: {ex.Message}");
                return StatusCode(500, $"An error occurred while creating the customer. CustomerId: {customerDTO.Id}");
            }
        }

        // PUT api/<CustomersController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCustomerAsync(string id, [FromBody] CustomerDTO customerDTO)
        {
            try
            {
                await _customerRepository.UpdateCustomerAsync(customerDTO);

                return Ok("Customer updated successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogInformation($"Error message: {ex.Message}");
                return StatusCode(500, $"An error occurred while creating the customer. CustomerId: {customerDTO.Id}");
            }
        }

        // DELETE api/<CustomersController>/5
        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}
    }
}

