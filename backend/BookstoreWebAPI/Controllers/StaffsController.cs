using Azure;
using Microsoft.AspNetCore.Mvc;
using BookstoreWebAPI.Exceptions;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Repository.Interfaces;
using BookstoreWebAPI.Services;
using FluentValidation;
using FluentValidation.Results;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookstoreWebAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class StaffsController(
        IStaffRepository staffRepository,
        ILogger<StaffsController> logger,
        IValidator<QueryParameters> queryParametersValidator,
        IValidator<StaffFilterModel> filterModelValidator,
        IFileService fileService
    ) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StaffDTO>>> GetStaffDTOsAsync(
            [FromQuery] QueryParameters queryParams,
            [FromQuery] StaffFilterModel filter
        )
        {
            ValidationResult queryParamResult = await queryParametersValidator.ValidateAsync(queryParams);
            if (!queryParamResult.IsValid) return BadRequest(queryParamResult.Errors);

            ValidationResult filterModelResult = await filterModelValidator.ValidateAsync(filter);
            if (!filterModelResult.IsValid) return BadRequest(filterModelResult.Errors);


            var staffs = await staffRepository.GetStaffDTOsAsync(queryParams, filter);
            int totalCount = staffRepository.TotalCount;

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

        [HttpGet("{id}")]
        public async Task<ActionResult<StaffDTO>> GetStaffDTOByIdAsync(string id)
        {
            var staff = await staffRepository.GetStaffDTOByIdAsync(id);

            if (staff == null)
            {
                return NotFound();
            }

            return Ok(staff);
        }

        [HttpPost]
        public async Task<ActionResult> AddStaffDTOASync([FromBody]StaffDTO staffDTO)
        {
            try
            {
                var createdStaffDTO = await staffRepository.AddStaffDTOAsync(staffDTO);
                
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
                logger.LogInformation(
                    $"Staff Name: {staffDTO.Name}" +
                    $"\nError message: {ex.Message}"
                );

                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateStaffAsync(string id, [FromBody] StaffDTO staffDTO)
        {
            if (id != staffDTO.StaffId)
            {
                return BadRequest("Specified id don't match with the DTO.");
            }

            try
            {

                await staffRepository.UpdateStaffDTOAsync(staffDTO);

                return NoContent();
            }
            catch (DuplicateDocumentException)
            {
                return Conflict("Email existed");
            }
            catch (Exception ex)
            {
                logger.LogError(
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
            if (ids == null || ids.Length == 0)
            {
                return BadRequest("ids is required.");
            }

            var result = await staffRepository.DeleteStaffDTOsAsync(ids);

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
                    fileModels.Add(await fileService.UploadAsync(file));
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
                await fileService.DeleteAsync(blobName);

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
