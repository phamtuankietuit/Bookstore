using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using SE100_BookstoreWebAPI.Models.Documents;
using SE100_BookstoreWebAPI.Models.DTOs;
using SE100_BookstoreWebAPI.Repository.Interfaces;
using SE100_BookstoreWebAPI.Utils;
using System.Formats.Asn1;

namespace SE100_BookstoreWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : Controller
    {
        private readonly IProductRepository _productRepository;
        private readonly ILogger<ProductsController> _logger;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _memoryCache;

        public ProductsController(IProductRepository productRepository, ILogger<ProductsController> logger, IMapper mapper, IMemoryCache memoryCache)
        {
            _productRepository = productRepository;
            _logger = logger;
            _mapper = mapper;
            this._memoryCache = memoryCache;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProductsAsync()
        {
            var products = await _productRepository.GetProductDTOsAsync();

            if (products == null || !products.Any()) 
            {
                _logger.LogInformation($"No product found!");
                return NotFound();
            }

            _logger.LogInformation($"Returned all products!");
            return Ok(products);
        }

        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<ProductDocument>>> GetProductsInCategoryAsync(string categoryId)
        {
            var products = await _productRepository.GetProductDocumentsInCategoryAsync(categoryId);

            if (products == null || !products.Any())
            {
                _logger.LogInformation($"No product found in category id {categoryId}!");
                return NotFound();
            }

            _logger.LogInformation($"Returned all products in category id {categoryId}!");
            return Ok(products);
        }


        [HttpGet("sku/{sku}")]
        public async Task<ActionResult<ProductDTO>> GetProductBySkuAsync(string sku)
        {
            var product = await _productRepository.GetProductDTOBySkuAsync(sku);

            if (product == null)
            {
                _logger.LogInformation($"Product with sku {sku} Not Found");
                return NotFound();
            }

            _logger.LogInformation($"Product with sku {sku} Found");

            return Ok(product);
        }

        [HttpGet("newId")]
        public async Task<ActionResult<string>> GetNewProductIdAsync()
        {
            string newId = await _productRepository.GetNewProductIdAsync();

            return Ok(newId);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDTO>> GetProductByIdAsync(string id)
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
            if (productDTO == null)
            {
                return BadRequest("Product data is required.");
            }

            try
            {
                await _productRepository.AddProductDTOAsync(productDTO);

                return Ok("Product created successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogInformation($"Error message: {ex.Message}");
                return StatusCode(500, $"An error occurred while creating the product. ProductId: {productDTO.ProductId}");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateProductAsync(string id, [FromBody] ProductDTO productDTO)
        {
            if (productDTO == null)
            {
                return BadRequest("Product data is required.");
            }

            try
            {
                await _productRepository.UpdateProductDTOAsync(productDTO);

                return Ok("Product created successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogInformation($"Error message: {ex.Message}");
                return StatusCode(500, $"An error occurred while updating the product. ProductId: {productDTO.ProductId}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProductAsync(string id)
        {
            try
            {
                await _productRepository.DeleteProductDTOAsync(id);

                return Ok("Product deleted successfully");
            }
            catch(Exception ex)
            {
                _logger.LogInformation($"Error message: {ex.Message}");
                return StatusCode(500, $"An error occurred while deleting the product. Product Id: {id}");
            }
        }
    }
}
