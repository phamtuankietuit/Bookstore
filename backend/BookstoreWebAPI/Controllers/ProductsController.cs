using Microsoft.AspNetCore.Mvc;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Repository.Interfaces;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using FluentValidation;
using FluentValidation.Results;
using BookstoreWebAPI.Services;
using Azure;

namespace BookstoreWebAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController(
        IProductRepository productRepository,
        ILogger<ProductsController> logger,
        IValidator<QueryParameters> validator,
        IValidator<ProductFilterModel> filterValidator,
        IFileService fileService,
        UserContextService userContextService
    ) : Controller
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProductDTOsAsync(
            [FromQuery] QueryParameters queryParams,
            [FromQuery] ProductFilterModel filter)
        {
            ValidationResult queryParamResult = await validator.ValidateAsync(queryParams);
            if (!queryParamResult.IsValid) return BadRequest(queryParamResult.Errors);

            ValidationResult filterModelResult = await filterValidator.ValidateAsync(filter);
            if (!filterModelResult.IsValid) return BadRequest(filterModelResult.Errors);


            var products = await productRepository.GetProductDTOsAsync(queryParams, filter);
            int totalCount = productRepository.TotalCount;

            if (products == null || !products.Any())
            {
                return NotFound();
            }

            logger.LogInformation($"Returned all products!");
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
            var result = await productRepository.GetDetailsAsync(detailName);

            if (result == null || !result.Any())
            {

                return NotFound();
            }

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDTO>> GetProductDTOByIdAsync(string id)
        {
            var product = await productRepository.GetProductDTOByIdAsync(id);

            if (product == null)
            {
                logger.LogInformation($"Product with id {id} Not Found");
                return NotFound();
            }

            logger.LogInformation($"Product with id {id} Found");

            return Ok(product);
        }


        [HttpPost]
        public async Task<ActionResult> CreateProductAsync([FromBody] ProductDTO productDTO)
        {
            var staffId = Request.Headers["staffId"].ToString();
            if (staffId == null) return Unauthorized();
            userContextService.Current.StaffId = staffId;

            try
            {
                var createdProductDTO = await productRepository.AddProductDTOAsync(productDTO);

                return CreatedAtAction(
                    nameof(GetProductDTOByIdAsync), // method
                    new { id = createdProductDTO.ProductId }, // param in method
                    createdProductDTO // values returning after the route
                );
            }
            catch (Exception ex)
            {
                logger.LogInformation(
                    $"Product Name: {productDTO.Name}" +
                    $"\nError message: {ex.Message}"
                );

                return Conflict(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateProductAsync(string id, [FromBody] ProductDTO productDTO)
        {
            var staffId = Request.Headers["staffId"].ToString();
            if (staffId == null) return Unauthorized();
            userContextService.Current.StaffId = staffId;

            if (id != productDTO.ProductId)
            {
                return BadRequest("Specified id don't match with the DTO.");
            }

            try
            {
                await productRepository.UpdateProductDTOAsync(productDTO);

                return NoContent();
            }
            catch (Exception ex)
            {
                logger.LogError(
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
            var staffId = Request.Headers["staffId"].ToString();
            if (staffId == null) return Unauthorized();
            userContextService.Current.StaffId = staffId;

            if (ids == null || ids.Length == 0)
            {
                return BadRequest("ids is required.");
            }

            var result = await productRepository.DeleteProductsAsync(ids);

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
            List<FileModel> fileModels = [];

            try
            {
                foreach(var file in files)
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
            }) ;
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