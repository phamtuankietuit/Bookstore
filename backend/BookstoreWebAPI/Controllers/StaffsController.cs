using BookstoreWebAPI.Exceptions;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Repository;
using BookstoreWebAPI.Repository.Interfaces;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.TagHelpers;
using Microsoft.Extensions.Azure;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookstoreWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffsController : ControllerBase
    {
        private readonly IStaffRepository _staffRepository;
        private readonly ILogger<StaffsController> _logger;
        private readonly IValidator<QueryParameters> _queryParametersValidator;

        public StaffsController(
            IStaffRepository staffRepository,
            ILogger<StaffsController> logger,
            IValidator<QueryParameters> queryParametersValidator)
        {
            _staffRepository = staffRepository;
            _logger = logger;
            _queryParametersValidator = queryParametersValidator;
        }

        // GET: api/<StaffsController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StaffDTO>>> GetStaffDTOsAsync(
            [FromQuery] QueryParameters queryParams
        )
        {
            ValidationResult result = await _queryParametersValidator.ValidateAsync(queryParams);

            if (!result.IsValid)
            {
                return BadRequest(result.Errors);
            }

            int totalCount = await _staffRepository.GetTotalCount(queryParams);
            var staffs = await _staffRepository.GetStaffDTOsAsync(queryParams);

            if (staffs == null || !staffs.Any())
            {
                return NotFound();
            }

            return Ok(new
            {
                data = staffs,
                metadata = new
                {
                    count = totalCount
                }
            });
        }

        // GET api/<StaffsController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StaffDTO>> GetStaffDTOByIdAsync(string id)
        {
            var staff = await _staffRepository.GetStaffDTOByIdAsync(id);

            if (staff == null)
            {
                return NotFound();
            }

            return Ok(staff);
        }


        // POST api/<StaffsController>
        [HttpPost]
        public async Task<ActionResult> AddStaffDTOASync([FromBody]StaffDTO staffDTO)
        {
            try
            {
                var createdStaffDTO = await _staffRepository.AddStaffDTOAsync(staffDTO);
                
                return CreatedAtAction(
                    nameof(GetStaffDTOByIdAsync),
                    new { id = createdStaffDTO.StaffId },
                    createdStaffDTO
                );
            }
            catch(InvalidEmailException ex)
            {
                return BadRequest(ex.Message);
            }
            catch(DuplicateDocumentException ex)
            {
                return Conflict(ex.Message);
            }
            catch(Exception ex)
            {
                _logger.LogInformation(
                    $"Staff Name: {staffDTO.Name}" +
                    $"\nError message: {ex.Message}"
                );

                return StatusCode(500, ex.Message);
            }
        }

        // PUT api/<StaffsController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateStaffAsync(string id, [FromBody] StaffDTO staffDTO)
        {
            if (id != staffDTO.StaffId)
            {
                return BadRequest("Specified id don't match with the DTO.");
            }

            try
            {

                await _staffRepository.UpdateStaffDTOAsync(staffDTO);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Updating failed. " +
                    $"\nStaff Id: {id}. " +
                    $"\nError message: {ex.Message}");

                return StatusCode(500,
                    $"An error occurred while updating the staff. \n" +
                    $"Staff Id: {id}\n" +
                    $"Error message: {ex.Message}");
            }
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteStaffsAsync([FromQuery] string[] ids)
        {
            if (ids == null || !ids.Any())
            {
                return BadRequest("ids is required.");
            }

            var result = await _staffRepository.DeleteStaffDTOsAsync(ids);

            if (result.IsSuccessful)
            {
                return NoContent();
            }

            if (result.IsNotFound)
            {
                return NotFound();
            }

            if (result.IsForbidden)
            {
                return StatusCode(403);
            }

            return StatusCode(207, result.Responses);
        }
    }
}
