using BookstoreWebAPI.Exceptions;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Repository.Interfaces;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookstoreWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupplierGroupsController : ControllerBase
    {
        private readonly ILogger _logger;
        private readonly ISupplierGroupRepository _supplierGroupRepository;
        private readonly IValidator<QueryParameters> _queryParametersValidator;

        public SupplierGroupsController(ILogger<SupplierGroupsController> logger, ISupplierGroupRepository supplierGroupRepository, IValidator<QueryParameters> validator)
        {
            _logger = logger;
            _supplierGroupRepository = supplierGroupRepository;
            _queryParametersValidator = validator;
        }

        // GET: api/<SupplierGroupsController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SupplierGroupDTO>>> GetSupplierGroupsAsync([FromQuery]QueryParameters queryParams)
        {
            // validate filter model
            ValidationResult result = await _queryParametersValidator.ValidateAsync(queryParams);

            if (!result.IsValid)
            {
                return BadRequest(result.Errors);
            }


            int totalCount = await _supplierGroupRepository.GetTotalCount();
            var supplierGroups = await _supplierGroupRepository.GetSupplierGroupDTOsAsync(queryParams);

            if (supplierGroups == null || !supplierGroups.Any())
            {
                return NotFound();
            }

            return Ok(new
            {
                data = supplierGroups,
                metadata = new
                {
                    count = totalCount
                }
            });
        }

        // GET api/<SupplierGroupsController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SupplierGroupDTO>> GetSupplierGroupDTOByIdAsync(string id)
        {
            var supplierGroup = await _supplierGroupRepository.GetSupplierGroupDTOByIdAsync(id);

            if (supplierGroup == null)
            {
                return NotFound();
            }

            return Ok(supplierGroup);
        }

        // POST api/<SupplierGroupsController>
        [HttpPost]
        public async Task<ActionResult> CreateSupplierGroupAsync([FromBody] SupplierGroupDTO supplierGroupDTO)
        {
            try
            {
                var createdSupplierGroupDTO = await _supplierGroupRepository.AddSupplierGroupDTOAsync(supplierGroupDTO);

                return CreatedAtAction(
                    nameof(GetSupplierGroupDTOByIdAsync),
                    new {id = createdSupplierGroupDTO.SupplierGroupId},
                    createdSupplierGroupDTO
                );
            }
            catch (DuplicateDocumentException ex)
            {
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogInformation(
                    $"SupplierGroup Name: {supplierGroupDTO.Name}" +
                    $"\nError message: {ex.Message}"
                );

                return StatusCode(500, ex.Message);
            }
        }

        // PUT api/<SupplierGroupsController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateSupplierGroupAsync(string id, [FromBody] SupplierGroupDTO supplierGroupDTO)
        {
            if (id != supplierGroupDTO.SupplierGroupId)
            {
                return BadRequest("Specified id don't match with the DTO.");
            }

            try
            {
                await _supplierGroupRepository.UpdateSupplierGroupDTOAsync(supplierGroupDTO);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Updating failed. " +
                    $"\nSupplier Group Id: {id}. " +
                    $"\nError message: {ex.Message}");

                return StatusCode(500,
                    $"An error occurred while updating the supplier group. \n" +
                    $"Supplier Group Id: {id}\n" +
                    $"Error message: {ex.Message}");
            }
        }


        [HttpDelete]
        public async Task<ActionResult> DeleteSupplierGroupsAsync([FromQuery] string[] ids)
        {
            if (ids == null || !ids.Any())
            {
                return BadRequest("ids is required.");
            }

            var result = await _supplierGroupRepository.DeleteSupplierGroupsAsync(ids);

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
