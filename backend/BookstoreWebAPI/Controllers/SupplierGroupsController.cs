using Microsoft.AspNetCore.Mvc;
using BookstoreWebAPI.Exceptions;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Repository.Interfaces;
using FluentValidation;
using FluentValidation.Results;
using BookstoreWebAPI.Services;

namespace BookstoreWebAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class SupplierGroupsController(
        ILogger<SupplierGroupsController> logger,
        ISupplierGroupRepository supplierGroupRepository,
        IValidator<QueryParameters> validator,
        UserContextService userContextService
    ) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SupplierGroupDTO>>> GetSupplierGroupsAsync(
            [FromQuery] QueryParameters queryParams,
            [FromQuery] SupplierGroupFilterModel filter)
        {
            // validate filter model
            ValidationResult queryParamsResult = await validator.ValidateAsync(queryParams);
            if (!queryParamsResult.IsValid) return BadRequest(queryParamsResult.Errors); 



            var supplierGroups = await supplierGroupRepository.GetSupplierGroupDTOsAsync(queryParams, filter);
            int totalCount = supplierGroupRepository.TotalCount;

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
            var supplierGroup = await supplierGroupRepository.GetSupplierGroupDTOByIdAsync(id);

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
            var staffId = Request.Headers["staffId"].ToString();
            if (string.IsNullOrEmpty(staffId)) return Unauthorized();
            userContextService.Current.StaffId = staffId;

            try
            {

                var createdSupplierGroupDTO = await supplierGroupRepository.AddSupplierGroupDTOAsync(supplierGroupDTO);

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
                logger.LogInformation(
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
            var staffId = Request.Headers["staffId"].ToString();
            if (string.IsNullOrEmpty(staffId)) return Unauthorized();
            userContextService.Current.StaffId = staffId;

            if (id != supplierGroupDTO.SupplierGroupId)
            {
                return BadRequest("Specified id don't match with the DTO.");
            }

            try
            {
                await supplierGroupRepository.UpdateSupplierGroupDTOAsync(supplierGroupDTO);

                return NoContent();
            }
            catch (DuplicateDocumentException ex)
            {
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                logger.LogError(
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
            var staffId = Request.Headers["staffId"].ToString();
            if (string.IsNullOrEmpty(staffId)) return Unauthorized();
            userContextService.Current.StaffId = staffId;

            if (ids == null || ids.Length == 0)
            {
                return BadRequest("ids is required.");
            }

            var result = await supplierGroupRepository.DeleteSupplierGroupsAsync(ids);

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
