using Microsoft.AspNetCore.Mvc;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Repository.Interfaces;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookstoreWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SuppliersController : ControllerBase
    {
        private readonly ILogger<SuppliersController> _logger;
        private readonly ISupplierRepository _supplierRepository;

        public SuppliersController(ILogger<SuppliersController> logger, ISupplierRepository supplierRepository)
        {
            this._logger = logger;
            this._supplierRepository = supplierRepository;
        }

        // GET: api/<SuppliersController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SupplierDTO>>> GetSupplierDTOsAsync()
        {
            var suppliers = await _supplierRepository.GetSupplierDTOsAsync();

            if (suppliers == null || !suppliers.Any())
            {
                return NotFound();
            }

            return Ok(suppliers);
        }

        [HttpGet("newId")]
        public async Task<ActionResult<string>> GetNewSupplierIdAsync()
        {
            string newId = await _supplierRepository.GetNewSupplierIdAsync();

            return Ok(newId);
        }

        // GET api/<SuppliersController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SupplierDTO>> GetSupplierDTOByIdAsync(string id)
        {
            var supplier = await _supplierRepository.GetSupplierDTOByIdAsync(id);

            if (supplier == null)
            {
                return NotFound();
            }

            return Ok(supplier);
        }

        // POST api/<SuppliersController>
        [HttpPost]
        public async Task<ActionResult> CreateSupplierAsync([FromBody] SupplierDTO supplierDTO)
        {
            try
            {
                await _supplierRepository.AddSupplierDTOAsync(supplierDTO);

                return Ok("Supplier created successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogInformation($"Error message: {ex.Message}");
                return StatusCode(500, $"An error occurred while creating the supplier. SupplierId: {supplierDTO.SupplierId}");
            }
        }

        // PUT api/<SuppliersController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateSupplierAsync(string id, [FromBody] SupplierDTO supplierDTO)
        {
            try
            {
                await _supplierRepository.UpdateSupplierAsync(supplierDTO);

                return Ok("Supplier updated successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogInformation($"Error message: {ex.Message}");
                return StatusCode(500, $"An error occurred while creating the supplier. SupplierId: {supplierDTO.SupplierId}");
            }
        }

        // DELETE api/<SuppliersController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteSupplierAsync(string id)
        {
            try
            {
                await _supplierRepository.DeleteSupplierAsync(id);

                return Ok("Supplier updated successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogInformation($"Error message: {ex.Message}");
                return StatusCode(500, $"An error occurred while creating the supplier. SupplierId: {id}");
            }
        }
    }
}
