using Microsoft.AspNetCore.Mvc;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Repository.Interfaces;
using FluentValidation;
using FluentValidation.Results;

namespace BookstoreWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SuppliersController(
        ISupplierRepository supplierRepository,
        ILogger<SuppliersController> logger,
        IValidator<QueryParameters> validator,
        IValidator<SupplierFilterModel> filterValidator
    ) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SupplierDTO>>> GetSupplierDTOsAsync([FromQuery] QueryParameters queryParams, [FromQuery]SupplierFilterModel filter)
        {
            ValidationResult queryParamResult = await validator.ValidateAsync(queryParams);
            if (!queryParamResult.IsValid) return BadRequest(queryParamResult.Errors);

            ValidationResult filterModelResult = await filterValidator.ValidateAsync(filter);
            if (!filterModelResult.IsValid) return BadRequest(filterModelResult.Errors);


            var suppliers = await supplierRepository.GetSupplierDTOsAsync(queryParams, filter);
            var totalCount = supplierRepository.TotalCount;

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

        [HttpGet("{id}")]
        public async Task<ActionResult<SupplierDTO>> GetSupplierDTOByIdAsync(string id)
        {
            var supplier = await supplierRepository.GetSupplierDTOByIdAsync(id);

            if (supplier == null)
            {
                return NotFound();
            }

            return Ok(supplier);
        }

        [HttpPost]
        public async Task<ActionResult> CreateSupplierAsync([FromBody]SupplierDTO supplierDTO)
        {
            try
            {
                var createdSupplierDTO = await supplierRepository.AddSupplierDTOAsync(supplierDTO);

                return CreatedAtAction(
                    nameof(GetSupplierDTOByIdAsync),
                    new { id = createdSupplierDTO.SupplierId},
                    createdSupplierDTO
                );
            }
            catch (Exception ex)
            {
                logger.LogInformation(
                    $"Supplier name: {supplierDTO.Name}" +
                    $"\nError message: {ex.Message}"
                );

                return Conflict(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateSupplierAsync(string id, [FromBody] SupplierDTO supplierDTO)
        {
            if (id != supplierDTO.SupplierId)
            {
                return BadRequest("Specified id don't match with the DTO.");
            }

            try
            {
                await supplierRepository.UpdateSupplierDTOAsync(supplierDTO);

                return NoContent();
            }
            catch (Exception ex)
            {
                logger.LogError(
                    $"Updating failed. " +
                    $"\nSupplier Id: {id}. " +
                    $"\nError message: {ex.Message}");

                return StatusCode(500, 
                    $"An error occurred while updating the supplier. \n" +
                    $"SupplierId: {id}\n" +
                    $"Error message: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteSupplierAsync([FromQuery]string[] ids)
        {
            if (ids == null || ids.Length == 0)
            {
                return BadRequest("ids is required.");
            }

            var result = await supplierRepository.DeleteSuppliersAsync(ids);

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
