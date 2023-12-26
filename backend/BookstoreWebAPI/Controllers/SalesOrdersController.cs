using Microsoft.AspNetCore.Mvc;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Repository.Interfaces;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookstoreWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesOrdersController : ControllerBase
    {
        private readonly ISalesOrderRepository _salesOrderRepository;
        private readonly ILogger<SalesOrdersController> _logger;

        public SalesOrdersController(ISalesOrderRepository salesOrderRepository, ILogger<SalesOrdersController> logger)
        {
            this._salesOrderRepository = salesOrderRepository;
            this._logger = logger;
        }

        // GET: api/<SalesOrdersController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SalesOrderDTO>>> GetSalesOrderDTOsAsync()
        {
            var salesOrders = await _salesOrderRepository.GetSalesOrderDTOsAsync();

            if (salesOrders == null || !salesOrders.Any())
            {
                return NotFound();
            }

            return Ok(salesOrders);
        }

        [HttpGet("newId")]
        public async Task<ActionResult<string>> GetNewOrderIdAsync()
        {
            string newId = await _salesOrderRepository.GetNewOrderIdAsync();

            return Ok(newId);
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
                await _salesOrderRepository.AddSalesOrderDTOAsync(salesOrderDTO);

                return Ok("SalesOrder created successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogInformation($"Error message: {ex.Message}");
                return StatusCode(500, $"An error occurred while creating the salesOrder. OrderId: {salesOrderDTO.OrderId}");
            }
        }

        // PUT api/<SalesOrdersController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateSalesOrderAsync(string id, [FromBody] SalesOrderDTO salesOrderDTO)
        {
            try
            {
                await _salesOrderRepository.UpdateSalesOrderAsync(salesOrderDTO);

                return Ok("SalesOrder updated successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogInformation($"Error message: {ex.Message}");
                return StatusCode(500, $"An error occurred while creating the salesOrder. OrderId: {salesOrderDTO.OrderId}");
            }
        }

        // DELETE api/<SalesOrdersController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteSalesOrderAsync(string id)
        {
            try
            {
                await _salesOrderRepository.DeleteSalesOrderAsync(id);

                return Ok("SalesOrder updated successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogInformation($"Error message: {ex.Message}");
                return StatusCode(500, $"An error occurred while creating the salesOrder. OrderId: {id}");
            }
        }
    }
}
