using Microsoft.AspNetCore.Mvc;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Repository;
using BookstoreWebAPI.Repository.Interfaces;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookstoreWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ILogger _logger;
        private readonly ICategoryRepository _categoryRepository;

        public CategoriesController(ILogger<CategoriesController> logger, ICategoryRepository categoryRepository)
        {
            this._logger = logger;
            this._categoryRepository = categoryRepository;
        }

        // GET: api/<CategoriesController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDTO>>> GetCategoriesAsync()
        {
            var categories = await _categoryRepository.GetCategoryDTOsAsync();

            if (categories == null || !categories.Any()) 
            {
                return NotFound();
            }

            return Ok(categories);
        }

        [HttpGet("newId")]
        public async Task<ActionResult<string>> GetNewCategoryIdAsync()
        {
            string newId = await _categoryRepository.GetNewCategoryIdAsync();

            return Ok(newId);
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
                await _categoryRepository.AddCategoryDTOAsync(categoryDTO);

                return Ok("Category created successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogInformation($"Error message: {ex.Message}");
                return StatusCode(500, $"An error occurred while creating the category. CategoryId: {categoryDTO.CategoryId}");
            }
        }

        // PUT api/<CategoriesController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCategoryAsync(string id, [FromBody] CategoryDTO categoryDTO)
        {
            try
            {
                await _categoryRepository.UpdateCategoryAsync(categoryDTO);

                return Ok("Category updated successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogInformation($"Error message: {ex.Message}");
                return StatusCode(500, $"An error occurred while creating the category. CategoryId: {categoryDTO.CategoryId}");
            }
        }

        // DELETE api/<CategoriesController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCategoryAsync(string id)
        {
            try
            {
                await _categoryRepository.DeleteCategoryAsync(id);

                return Ok("Category updated successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogInformation($"Error message: {ex.Message}");
                return StatusCode(500, $"An error occurred while creating the category. CategoryId: {id}");
            }
        }
    }
}
