using Microsoft.AspNetCore.Mvc;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Repository.Interfaces;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using Microsoft.Extensions.Options;
using FluentValidation;
using FluentValidation.Results;
using BookstoreWebAPI.Services;
using Azure;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Authorization;

namespace BookstoreWebAPI.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : Controller
    {
        private readonly IProductRepository _productRepository;
        private readonly ILogger<ProductsController> _logger;
        private readonly IValidator<QueryParameters> _queryParametersValidator;
        private readonly IValidator<ProductFilterModel> _filterValidator;
        
        private readonly IFileService _fileService;

        public ProductsController(
            IProductRepository productRepository,
            ILogger<ProductsController> logger,
            IValidator<QueryParameters> validator,
            IValidator<ProductFilterModel> filterValidator,
            IFileService fileService)
        {
            _productRepository = productRepository;
            _logger = logger;
            _queryParametersValidator = validator;
            _fileService = fileService;
            _filterValidator = filterValidator;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProductDTOsAsync(
            [FromQuery] QueryParameters queryParams,
            [FromQuery] ProductFilterModel filter)
        {
            ValidationResult queryParamResult = await _queryParametersValidator.ValidateAsync(queryParams);
            if (!queryParamResult.IsValid) return BadRequest(queryParamResult.Errors);

            ValidationResult filterModelResult = await _filterValidator.ValidateAsync(filter);
            if (!filterModelResult.IsValid) return BadRequest(filterModelResult.Errors);


            int totalCount = await _productRepository.GetTotalCount(queryParams, filter);
            var products = await _productRepository.GetProductDTOsAsync(queryParams, filter);

            if (products == null || !products.Any())
            {
                return NotFound();
            }

            _logger.LogInformation($"Returned all products!");
            return Ok(new
            {
                data = products,
                metadata = new
                {
                    count = totalCount
                }
            });
        }

        [HttpGet("details/{detailName}")]
        public async Task<ActionResult<IEnumerable<string>>> GetProductDetailListAsync(string detailName)
        {
            var result = await _productRepository.GetDetailsAsync(detailName);

            if (result == null || !result.Any())
            {

                return NotFound();
            }

            return Ok(result);
        }



        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDTO>> GetProductDTOByIdAsync(string id)
        {
            var product = await _productRepository.GetProductDTOByIdAsync(id);

            if (product == null)
            {
                _logger.LogInformation($"Product with id {id} Not Found");
                return NotFound();
            }

            _logger.LogInformation($"Product with id {id} Found");

            return Ok(product);
        }


        [HttpPost]
        public async Task<ActionResult> CreateProductAsync([FromBody] ProductDTO productDTO)
        {
            try
            {
                var createdProductDTO = await _productRepository.AddProductDTOAsync(productDTO);

                return CreatedAtAction(
                    nameof(GetProductDTOByIdAsync), // method
                    new { id = createdProductDTO.ProductId }, // param in method
                    createdProductDTO // values returning after the route
                );
            }
            catch (Exception ex)
            {
                _logger.LogInformation(
                    $"Product Name: {productDTO.Name}" +
                    $"\nError message: {ex.Message}"
                );

                return Conflict(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateProductAsync(string id, [FromBody] ProductDTO productDTO)
        {
            if (id != productDTO.ProductId)
            {
                return BadRequest("Specified id don't match with the DTO.");
            }

            try
            {
                await _productRepository.UpdateProductDTOAsync(productDTO);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Updating failed. " +
                    $"\nProduct Id: {id}. " +
                    $"\nError message: {ex.Message}");

                return StatusCode(500,
                    $"An error occurred while updating the product. \n" +
                    $"Product Id: {id}\n" +
                    $"Error message: {ex.Message}");
            }
        }

        [HttpDelete()]
        public async Task<ActionResult> DeleteProductsAsync([FromQuery] string[] ids)
        {
            if (ids == null || !ids.Any())
            {
                return BadRequest("ids is required.");
            }

            var result = await _productRepository.DeleteProductsAsync(ids);

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

                foreach(var file in files)
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
            }) ;
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