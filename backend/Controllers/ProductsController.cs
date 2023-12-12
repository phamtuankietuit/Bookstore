using Microsoft.AspNetCore.Mvc;
using SE100_BookstoreWebAPI.Models.Documents;
using SE100_BookstoreWebAPI.Repository;

namespace SE100_BookstoreWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : Controller
    {
        private readonly IProductRepository _productRepository;
        private readonly ILogger<ProductsController> _logger;

        public ProductsController(IProductRepository productRepository, ILogger<ProductsController> logger)
        {
            _productRepository = productRepository;
            _logger = logger;
        }

        [HttpGet("category/{categoryName}")]
        public async Task<ActionResult<IEnumerable<ProductDocument>>> GetAllProductsInCategoryAsync(string categoryName)
        {
            var products = await _productRepository.GetAllProductsInCategoryAsync(categoryName);

            if (products == null || !products.Any()) 
            {
                _logger.LogInformation($"No product found in category {categoryName}!");
                return NotFound();
            }

            _logger.LogInformation($"Returned all products in category {categoryName}!");
            return Ok(products);
        }


        [HttpGet("sku/{sku}")]
        public async Task<ActionResult<ProductDocument>> GetProductBySku(string sku)
        {
            var product = await _productRepository.GetProductBySkuAsync(sku);

            if (product == null)
            {
                _logger.LogInformation($"Product with sku {sku} Not Found");
                return NotFound();
            }

            _logger.LogInformation($"Product with sku {sku} Found");

            return Ok(product);
        }
    }
}
