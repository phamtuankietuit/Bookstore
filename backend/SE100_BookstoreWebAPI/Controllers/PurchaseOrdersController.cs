using Microsoft.AspNetCore.Mvc;
using SE100_BookstoreWebAPI.Models.DTOs;
using SE100_BookstoreWebAPI.Repository.Interfaces;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SE100_BookstoreWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PurchaseOrdersController : ControllerBase
    {
        private readonly ILogger<PurchaseOrdersController> _logger;
        private readonly IPurchaseOrderRepository _purchaseOrderRepository;

        public PurchaseOrdersController(ILogger<PurchaseOrdersController> logger, IPurchaseOrderRepository purchaseOrderRepository)
        {
            this._logger = logger;
            this._purchaseOrderRepository = purchaseOrderRepository;
        }

        // GET: api/<PurchaseOrdersController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PurchaseOrderDTO>>> GetPurchaseOrderDTOsAsync()
        {
            var purchaseOrders = await _purchaseOrderRepository.GetPurchaseOrderDTOsAsync();

            if (purchaseOrders == null || !purchaseOrders.Any())
            {
                return NotFound();
            }

            return Ok(purchaseOrders);
        }

        [HttpGet("newId")]
        public async Task<ActionResult<string>> GetNewPurchaseOrderIdAsync()
        {
            string newId = await _purchaseOrderRepository.GetNewPurchaseOrderIdAsync();

            return Ok(newId);
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
                await _purchaseOrderRepository.AddPurchaseOrderDTOAsync(purchaseOrderDTO);

                return Ok("PurchaseOrder created successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogInformation($"Error message: {ex.Message}");
                return StatusCode(500, $"An error occurred while creating the purchaseOrder. PurchaseOrderId: {purchaseOrderDTO.PurchaseOrderId}");
            }
        }

        // PUT api/<PurchaseOrdersController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdatePurchaseOrderAsync(string id, [FromBody] PurchaseOrderDTO purchaseOrderDTO)
        {
            try
            {
                await _purchaseOrderRepository.UpdatePurchaseOrderAsync(purchaseOrderDTO);

                return Ok("PurchaseOrder updated successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogInformation($"Error message: {ex.Message}");
                return StatusCode(500, $"An error occurred while creating the purchaseOrder. PurchaseOrderId: {purchaseOrderDTO.PurchaseOrderId}");
            }
        }

        // DELETE api/<PurchaseOrdersController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePurchaseOrderAsync(string id)
        {
            try
            {
                await _purchaseOrderRepository.DeletePurchaseOrderAsync(id);

                return Ok("PurchaseOrder updated successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogInformation($"Error message: {ex.Message}");
                return StatusCode(500, $"An error occurred while creating the purchaseOrder. PurchaseOrderId: {id}");
            }
        }
    }
}
