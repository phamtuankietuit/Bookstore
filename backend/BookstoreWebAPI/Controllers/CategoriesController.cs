using Microsoft.AspNetCore.Mvc;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Repository.Interfaces;
using BookstoreWebAPI.Models.BindingModels;
using FluentValidation.Results;
using FluentValidation;
using BookstoreWebAPI.Exceptions;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookstoreWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ILogger _logger;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IValidator<QueryParameters> _queryParametersValidator;
        private readonly IActivityLogRepository _activityLogRepository;

        public CategoriesController(
            ILogger<CategoriesController> logger,
            ICategoryRepository categoryRepository,
            IValidator<QueryParameters> validator,
            IActivityLogRepository activityLogRepository)
        {
            _logger = logger;
            _categoryRepository = categoryRepository;
            _queryParametersValidator = validator;
            _activityLogRepository = activityLogRepository;
        }

        // GET: api/<CategoriesController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDTO>>> GetCategoriesAsync([FromQuery]QueryParameters queryParams)
        {
            // validate filter model
            ValidationResult result = await _queryParametersValidator.ValidateAsync(queryParams);

            if (!result.IsValid)
            {
                return BadRequest(result.Errors);
            }


            int totalCount = await _categoryRepository.GetTotalCount(queryParams);
            var categories = await _categoryRepository.GetCategoryDTOsAsync(queryParams);

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

        // GET api/<CategoriesController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDTO>> GetCategoryDTOByIdAsync(string id)
        {
            var category = await _categoryRepository.GetCategoryDTOByIdAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            return Ok(category);
        }

        // POST api/<CategoriesController>
        [HttpPost]
        public async Task<ActionResult> CreateCategoryAsync([FromBody] CategoryDTO categoryDTO)
        {
            try
            {
                var createdCategoryDTO = await _categoryRepository.AddCategoryDTOAsync(categoryDTO);

                return CreatedAtAction(
                    nameof(GetCategoryDTOByIdAsync), // method
                    new { id = createdCategoryDTO.CategoryId }, // param in method
                    createdCategoryDTO // values returning after the route
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

        // PUT api/<CategoriesController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCategoryAsync(string id, [FromBody] CategoryDTO categoryDTO)
        {
            if (id != categoryDTO.CategoryId)
            {
                return BadRequest("Specified id don't match with the DTO.");
            }

            try
            {

                await _categoryRepository.UpdateCategoryDTOAsync(categoryDTO);

                return NoContent();
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
            if (ids == null || !ids.Any())
            {
                return BadRequest("ids is required.");
            }

            var result = await _categoryRepository.DeleteCategoriesAsync(ids);

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
