using AutoMapper;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Caching.Memory;
using SE100_BookstoreWebAPI.Models.Documents;
using SE100_BookstoreWebAPI.Models.DTOs;
using SE100_BookstoreWebAPI.Repository.Interfaces;
using SE100_BookstoreWebAPI.Utils;

namespace SE100_BookstoreWebAPI.Repository
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ILogger<CategoryRepository> _logger;
        private readonly IMapper _mapper;
        private readonly IProductRepository _productRepository;
        private readonly IMemoryCache _memoryCache;
        private Container _categoryContainer;
        private Container _productContainer;

        public CategoryRepository(
            CosmosClient cosmosClient, 
            ILogger<CategoryRepository> logger, 
            IMapper mapper, 
            IProductRepository productRepository, 
            IMemoryCache memoryCache) 
        {
            this._logger = logger;
            this._mapper = mapper;
            this._productRepository = productRepository;
            this._memoryCache = memoryCache;
            var databaseName = cosmosClient.ClientOptions.ApplicationName;
            var containerName = "categories";

            _categoryContainer = cosmosClient.GetContainer(databaseName, containerName);
            _productContainer = cosmosClient.GetContainer(databaseName, "products");
        }

        public async Task AddCategoryDocumentAsync(CategoryDocument item)
        {
            try
            {
                var response = await _categoryContainer.UpsertItemAsync(
                    item: item,
                    partitionKey: new PartitionKey(item.CategoryId)
                );
            }
            catch (Exception ex)
            {
                _logger.LogError("Upsert Item failed"); 
            }
        }

        public async Task<CategoryDTO?> GetCategoryDTOByIdAsync(string id)
        {
            var categoryDoc = await GetCategoryDocumentByIdAsync(id);

            var categoryDTO = _mapper.Map<CategoryDTO>(categoryDoc);

            return categoryDTO;
        }

        public async Task<IEnumerable<CategoryDTO>> GetCategoryDTOsAsync()
        {
            var queryDef = new QueryDefinition(
                query:
                    "SELECT * " +
                    "FROM c"
            );

            var categoryDocs = await CosmosDbUtils.GetDocumentsByQueryDefinition<CategoryDocument>(_categoryContainer, queryDef);
            var categoryDTOs = categoryDocs.Select(categoryDoc =>
            {
                return _mapper.Map<CategoryDTO>(categoryDoc);
            }).ToList();

            return categoryDTOs;
        }

        public async Task AddCategoryDTOAsync(CategoryDTO categoryDTO)
        {
            var categoryDoc = _mapper.Map<CategoryDocument>(categoryDTO);

            await AddCategoryDocumentAsync(categoryDoc);
        }
        
        public async Task UpdateCategoryAsync(CategoryDTO item)
        {
            var categoryToUpdate = _mapper.Map<CategoryDocument>(item);

            await _categoryContainer.UpsertItemAsync(
                item: categoryToUpdate,
                partitionKey: new PartitionKey(categoryToUpdate.CategoryId)
            );

            // Change feed to update products
        }

        public async Task DeleteCategoryAsync(string categoryId)
        {
            var categoryDoc = await GetCategoryDocumentByIdAsync(categoryId);

            if (categoryDoc == null)
            {
                throw new Exception("Category Not found!");
            }

            List<PatchOperation> patchOperations = new List<PatchOperation>()
            {
                PatchOperation.Replace("/isDeleted", true)
            };

            await _categoryContainer.PatchItemAsync<CategoryDocument>(categoryId, new PartitionKey(categoryDoc.CategoryId), patchOperations);
        }

        private async Task<CategoryDocument?> GetCategoryDocumentByIdAsync(string id)
        {
            var queryDef = new QueryDefinition(
                query:
                    "SELECT * " +
                    "FROM c " +
                    "WHERE c.id = @id"
            ).WithParameter("@id", id);

            var category = await CosmosDbUtils.GetDocumentByQueryDefinition<CategoryDocument>(_categoryContainer, queryDef);

            return category;
        }

        private async Task<CategoryDocument?> GetCategoryDocumentByNameAsync(string name)
        {
            var queryDef = new QueryDefinition(
                query:
                    "SELECT * " +
                    "FROM c " +
                    "WHERE c.name = @name"
            ).WithParameter("@name", name);

            var category = await CosmosDbUtils.GetDocumentByQueryDefinition<CategoryDocument>(_categoryContainer, queryDef);

            return category;
        }

        public async Task<string> GetNewCategoryIdAsync()
        {
            if (_memoryCache.TryGetValue("LastestCategoryId", out string? lastestId))
            {
                if (!String.IsNullOrEmpty(lastestId))
                    return lastestId;
            }

            // Query the database to get the latest product ID
            QueryDefinition queryDef = new QueryDefinition(
                query:
                "SELECT TOP 1 c.id " +
                "FROM c " +
                "ORDER BY c.id DESC"
            );

            string currLastestId = (await CosmosDbUtils.GetDocumentByQueryDefinition<ResponseToGetId>(_categoryContainer, queryDef))!.Id;
            string newId = IdUtils.IncreaseId(currLastestId);

            _memoryCache.Set("LastestCategoryId", newId);
            return newId;
        }
    }
}
