using Microsoft.AspNetCore.Mvc;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Repository.Interfaces;
using BookstoreWebAPI.Models.BindingModels;
using FluentValidation.Results;
using FluentValidation;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Repository;
using Microsoft.AspNetCore.Authorization;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookstoreWebAPI.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class SuppliersController : ControllerBase
    {
        private readonly ILogger<SuppliersController> _logger;
        private readonly ISupplierRepository _supplierRepository;
        private readonly IValidator<QueryParameters> _queryParametersValidator;
        private readonly IValidator<SupplierFilterModel> _filterValidator;

        public SuppliersController(
            ISupplierRepository supplierRepository,
            ILogger<SuppliersController> logger,
            IValidator<QueryParameters> validator,
            IValidator<SupplierFilterModel> filterValidator)
        {
            _logger = logger;
            _supplierRepository = supplierRepository;
            _queryParametersValidator = validator;
            _filterValidator = filterValidator;
        }

        // GET: api/<SuppliersController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SupplierDTO>>> GetSupplierDTOsAsync([FromQuery] QueryParameters queryParams, [FromQuery]SupplierFilterModel filter)
        {
            // validate filter model
            ValidationResult queryParamResult = await _queryParametersValidator.ValidateAsync(queryParams);
            if (!queryParamResult.IsValid) return BadRequest(queryParamResult.Errors);

            ValidationResult filterModelResult = await _filterValidator.ValidateAsync(filter);
            if (!filterModelResult.IsValid) return BadRequest(filterModelResult.Errors);


            var totalCount = await _supplierRepository.GetTotalCount();
            var suppliers = await _supplierRepository.GetSupplierDTOsAsync(queryParams, filter);

            if (suppliers == null || !suppliers.Any())
            {
                return NotFound();
            }

            return Ok(new
            {
                data = suppliers,
                metadata = new
                {
                    count = totalCount
                }
            });
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
        public async Task<ActionResult> CreateSupplierAsync([FromBody]SupplierDTO supplierDTO)
        {
            try
            {
                var createdSupplierDTO = await _supplierRepository.AddSupplierDTOAsync(supplierDTO);

                return CreatedAtAction(
                    nameof(GetSupplierDTOByIdAsync),
                    new { id = createdSupplierDTO.SupplierId},
                    createdSupplierDTO
                );
            }
            catch (Exception ex)
            {
                _logger.LogInformation(
                    $"Supplier name: {supplierDTO.Name}" +
                    $"\nError message: {ex.Message}"
                );

                return Conflict(ex.Message);
            }
        }

        // PUT api/<SuppliersController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateSupplierAsync(string id, [FromBody] SupplierDTO supplierDTO)
        {
            if (id != supplierDTO.SupplierId)
            {
                return BadRequest("Specified id don't match with the DTO.");
            }

            try
            {
                await _supplierRepository.UpdateSupplierDTOAsync(supplierDTO);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Updating failed. " +
                    $"\nSupplier Id: {id}. " +
                    $"\nError message: {ex.Message}");

                return StatusCode(500, 
                    $"An error occurred while updating the supplier. \n" +
                    $"SupplierId: {id}\n" +
                    $"Error message: {ex.Message}");
            }
        }

        // DELETE api/<SuppliersController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteSupplierAsync([FromQuery]string[] ids)
        {
            if (ids == null || !ids.Any())
            {
                return BadRequest("ids is required.");
            }

            var result = await _supplierRepository.DeleteSuppliersAsync(ids);

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
