using Azure;
using BookstoreWebAPI.Exceptions;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Repository.Interfaces;
using BookstoreWebAPI.Services;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
        private readonly IValidator<StaffFilterModel> _filterValidator;
        private readonly IFileService _fileService;

        public StaffsController(
            IStaffRepository staffRepository,
            ILogger<StaffsController> logger,
            IValidator<QueryParameters> queryParametersValidator,
            IValidator<StaffFilterModel> filterModelValidator,
            IFileService fileService)
        {
            _staffRepository = staffRepository;
            _logger = logger;
            _queryParametersValidator = queryParametersValidator;
            _fileService = fileService;
            _filterValidator = filterModelValidator;
        }

        // GET: api/<StaffsController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StaffDTO>>> GetStaffDTOsAsync(
            [FromQuery] QueryParameters queryParams,
            [FromQuery] StaffFilterModel filter
        )
        {
            ValidationResult queryParamResult = await _queryParametersValidator.ValidateAsync(queryParams);
            if (!queryParamResult.IsValid) return BadRequest(queryParamResult.Errors);

            ValidationResult filterModelResult = await _filterValidator.ValidateAsync(filter);
            if (!filterModelResult.IsValid) return BadRequest(filterModelResult.Errors);


            var staffs = await _staffRepository.GetStaffDTOsAsync(queryParams, filter);
            int totalCount = _staffRepository.TotalCount;

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
            catch (DuplicateDocumentException)
            {
                return Conflict("Email existed");
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

        [HttpPost("images")]
        public async Task<ActionResult> UploadImagesAsync(List<IFormFile> files)
        {
            List<FileModel> fileModels = new();

            try
            {

                foreach (var file in files)
                {
                    fileModels.Add(await _fileService.UploadAsync(file));
                }
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (RequestFailedException)
            {
                return StatusCode(500, "Upload failed");
            }
            catch (Exception ex)
            {
                return Conflict(ex.Message);

            }

            var urls = fileModels.Select(x => x.Url);
            var count = urls.Count();

            return Ok(new
            {
                data = urls,
                metadata = new
                {
                    count
                }
            });
        }


        [HttpDelete("images/{blobName}")]
        public async Task<ActionResult> DeleteImageAsync(string blobName)
        {
            try
            {
                await _fileService.DeleteAsync(blobName);

                return Ok($"Blob {blobName} deleted successfully.");
            }
            catch (RequestFailedException)
            {
                return StatusCode(500, "Delete failed");
            }
            catch (Exception ex)
            {
                return Conflict(ex.Message);
            }
        }
    }
}
