using Microsoft.AspNetCore.Mvc;
using BookstoreWebAPI.Services;
using BookstoreWebAPI.Exceptions;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Repository.Interfaces;
using FluentValidation.Results;
using FluentValidation;

namespace BookstoreWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController(
        ILogger<CategoriesController> logger,
        ICategoryRepository categoryRepository,
        IValidator<QueryParameters> validator,
        UserContextService userContextService) : ControllerBase
    {
        private readonly ILogger _logger = logger;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDTO>>> GetCategoriesAsync(
            [FromQuery]QueryParameters queryParams,
            [FromQuery]CategoryFilterModel filter)
        {
            ValidationResult result = await validator.ValidateAsync(queryParams);

            if (!result.IsValid)
            {
                return BadRequest(result.Errors);
            }

            var categories = await categoryRepository.GetCategoryDTOsAsync(queryParams, filter);
            int totalCount = categoryRepository.TotalCount;

            if (categories == null || !categories.Any()) 
            {
                return NotFound();
            }

            return Ok(new 
            { 
                data = categories, 
                metadata = new 
                { 
                    count = totalCount
                } 
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDTO>> GetCategoryDTOByIdAsync(string id)
        {
            var category = await categoryRepository.GetCategoryDTOByIdAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            return Ok(category);
        }

        [HttpPost]
        public async Task<ActionResult> CreateCategoryAsync([FromBody] CategoryDTO categoryDTO)
        {
            var staffId = Request.Headers["staffId"].ToString();
            if (string.IsNullOrEmpty(staffId)) return Unauthorized();
            userContextService.Current.StaffId = staffId;

            try
            {
                var createdCategoryDTO = await categoryRepository.AddCategoryDTOAsync(categoryDTO);

                return CreatedAtAction(
                    nameof(GetCategoryDTOByIdAsync), 
                    new { id = createdCategoryDTO.CategoryId }, 
                    createdCategoryDTO
                );
            }
            catch (DuplicateDocumentException ex)
            {
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogInformation(
                    $"Category Name: {categoryDTO.Text}" +
                    $"\nError message: {ex.Message}"
                );

                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCategoryAsync(string id, [FromBody] CategoryDTO categoryDTO)
        {
            var staffId = Request.Headers["staffId"].ToString();
            if (string.IsNullOrEmpty(staffId)) return Unauthorized();
            userContextService.Current.StaffId = staffId;

            if (id != categoryDTO.CategoryId)
            {
                return BadRequest("Specified id don't match with the DTO.");
            }

            try
            {

                await categoryRepository.UpdateCategoryDTOAsync(categoryDTO);

                return NoContent();
            }
            catch (DuplicateDocumentException ex)
            {
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Updating failed. " +
                    $"\nCategory Id: {id}. " +
                    $"\nError message: {ex.Message}");

                return StatusCode(500,
                    $"An error occurred while updating the category. \n" +
                    $"Category Id: {id}\n" +
                    $"Error message: {ex.Message}");
            }
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteCategoriesAsync([FromQuery] string[] ids)
        {
            var staffId = Request.Headers["staffId"].ToString();
            if (string.IsNullOrEmpty(staffId)) return Unauthorized();
            userContextService.Current.StaffId = staffId;

            if (ids == null || ids.Length == 0)
            {
                return BadRequest("ids is required.");
            }

            var result = await categoryRepository.DeleteCategoriesAsync(ids);

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
