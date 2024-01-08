using AutoMapper;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Caching.Memory;
using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Repository.Interfaces;
using BookstoreWebAPI.Utils;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.Responses;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Services;
using Azure.Search.Documents.Models;
using Newtonsoft.Json;
using BookstoreWebAPI.Models.Shared;

namespace BookstoreWebAPI.Repository
{
    public class ProductRepository : IProductRepository
    {
        private readonly string cacheInventoryNewIdName = "LatestInventoryId";
        private readonly string cacheProductNewIdName = "LatestProductId";
        private readonly ILogger<CategoryRepository> _logger;
        private readonly IMemoryCache _memoryCache;
        private readonly IMapper _mapper;
        private readonly IActivityLogRepository _activityLogRepository;
        private readonly Container _productContainer;
        private readonly Container _inventoryContainer;
        private readonly Container _categoryContainer;
        private CategoryDocument _defaultCategoryDoc;
        private readonly UserContextService _userContextService;

        private readonly AzureSearchService _searchService;

        public int TotalCount { get; set; }

        public ProductRepository(
            CosmosClient cosmosClient,
            ILogger<CategoryRepository> logger,
            IMemoryCache memoryCache,
            IMapper mapper,
            IActivityLogRepository activityLogRepository,
            AzureSearchServiceFactory searchServiceFactory,
            UserContextService userContextService)
        {
            _logger = logger;
            _memoryCache = memoryCache;
            _mapper = mapper;
            var databaseName = cosmosClient.ClientOptions.ApplicationName;
            var containerName = "products";

            _productContainer = cosmosClient.GetContainer(databaseName, containerName);
            _inventoryContainer = cosmosClient.GetContainer(databaseName, "inventories");
            _categoryContainer = cosmosClient.GetContainer(databaseName, "categories");
            _activityLogRepository = activityLogRepository;


            _searchService = searchServiceFactory.Create(containerName);
            _userContextService = userContextService;
        }

        public async Task<int> GetTotalCount(QueryParameters queryParams, ProductFilterModel filter)
        {
            var tempQueryParams = new QueryParameters()
            {
                PageNumber = 1,
                PageSize = -1
            };

            var productDocs = await GetProductDocumentsAsync(tempQueryParams, filter);

            var count = productDocs.Count();

            return count;
        }

        public async Task<IEnumerable<ProductDTO>> GetProductDTOsAsync(QueryParameters queryParams, ProductFilterModel filter)
        {
            var productDocs = await GetProductDocumentsAsync(queryParams, filter);

            if (productDocs == null || !productDocs.Any())
            {
                return Enumerable.Empty<ProductDTO>();
            }

            List<InventoryDocument> inventoryDocs = new();
            foreach (var productDoc in productDocs)
            {
                inventoryDocs.Add(await GetInventoryDocumentBySkuASync(productDoc.Sku));
            }

            var productDTOs = productDocs.Select(productDoc =>
            {
                var inventoryDoc = inventoryDocs.FirstOrDefault(inv => inv.ProductId == productDoc.ProductId);
                return _mapper.Map<ProductDTO>((productDoc, inventoryDoc));
            }).ToList();

            //TotalCount = inventoryDocs.Count();

            return productDTOs;
        }

        public async Task<ProductDTO> GetProductDTOByIdAsync(string id)
        {
            var productDoc = await GetProductDocumentByIdAsync(id);
            CheckForNull(productDoc);

            var inventoryDoc = await GetInventoryDocumentByProductIdAsync(id);
            CheckForNull(inventoryDoc);

            var result = _mapper.Map<ProductDTO>((productDoc, inventoryDoc));

            return result;
        }

        public async Task<IEnumerable<string>?> GetDetailsAsync(string detailName)
        {
            var queryDef = new QueryDefinition(
                query:
                $"SELECT DISTINCT c.details.{detailName} as \"value\"" +
                $"FROM c " +
                $"WHERE c.isDeleted = false and IS_DEFINED(c.details.{detailName})"
            );

            var result = await CosmosDbUtils.GetScalarValuesByQueryDefinition<ResponseToGetString>(_productContainer, queryDef);

            if (result == null)
                return null;

            var lastRes = result.Select(r => r.Value).ToList();

            return lastRes!;
        }

        public async Task<ProductDTO> AddProductDTOAsync(ProductDTO productDTO)
        {
            var productDoc = _mapper.Map<ProductDocument>(productDTO);
            var inventoryDoc = _mapper.Map<InventoryDocument>(productDTO);


            await PopulateDataToNewDocument(productDoc, inventoryDoc);
            

            var createdInventory = await AddInventoryDocumentAsync(inventoryDoc);
            var createdProduct = await AddProductDocumentAsync(productDoc);

            if (createdInventory.StatusCode == System.Net.HttpStatusCode.Created && 
                createdProduct.StatusCode == System.Net.HttpStatusCode.Created)
            {
                _memoryCache.Set(cacheInventoryNewIdName, IdUtils.IncreaseId(inventoryDoc.Id));
                _memoryCache.Set(cacheProductNewIdName, IdUtils.IncreaseId(productDoc.Id));
                
                await _activityLogRepository.LogActivity(
                    Enums.ActivityType.create,
                    _userContextService.Current.StaffId,
                    "Sản phẩm",
                    productDoc.ProductId
                );

                return _mapper.Map<ProductDTO>((productDoc, inventoryDoc));
            }

            throw new ArgumentNullException(nameof(createdInventory));
        }

        
        public async Task UpdateProductDTOAsync(ProductDTO productDTO)
        {
            var productDoc = _mapper.Map<ProductDocument>(productDTO);
            var inventoryDoc = _mapper.Map<InventoryDocument>(productDTO);


            var productDocInDb = await GetProductDocumentByIdAsync(productDoc.Id);
            var inventoryDocInDb = await GetInventoryDocumentByProductIdAsync(productDoc.Id);

            // check if this is price update, add it to price history
            if (productDoc.SalePrice != productDocInDb.SalePrice)
            {
                productDoc.SalePriceHistory.Add(new PriceHistory()
                {
                    Date = DateTime.UtcNow,
                    Value = productDocInDb.SalePrice
                });
            }


            inventoryDoc.Id = inventoryDocInDb!.Id;
            inventoryDoc.LastRestocked = inventoryDocInDb.LastRestocked;

            productDoc.ModifiedAt = DateTime.UtcNow;
            inventoryDoc.ModifiedAt = DateTime.UtcNow;

            await _productContainer.UpsertItemAsync(
                item: productDoc,
                partitionKey: new PartitionKey(productDoc.Sku));

            await _inventoryContainer.UpsertItemAsync(
                item: inventoryDoc,
                partitionKey: new PartitionKey(inventoryDoc.Sku));

            await _activityLogRepository.LogActivity(
                    Enums.ActivityType.update,
                    _userContextService.Current.StaffId,
                    "Sản phẩm",
                    productDoc.ProductId
                );

            _logger.LogInformation($"Product and inventory with id {productDoc.Id} added");
        }

        public async Task<BatchDeletionResult<ProductDTO>> DeleteProductsAsync(string[] ids)
        { 
            BatchDeletionResult<ProductDTO> result = new()
            {
                Responses = new(),
                IsNotSuccessful = true,
                IsNotForbidden = true,
                IsFound = true
            };
            
            int currOrder = 0;

            foreach (var id in ids)
            {
                currOrder++;
                var productDoc = await GetProductDocumentByIdAsync(id);
                var inventoryDoc = await GetInventoryDocumentByProductIdAsync(id);
                var productDTO = _mapper.Map<ProductDTO>((productDoc, inventoryDoc));

                if (productDoc == null || inventoryDoc == null)
                {
                    CosmosDbUtils.AddResponse(
                        batchDeletionResult: result,
                        responseOrder: currOrder,
                        responseData: productDTO,
                        statusCode: 404
                    );
                    continue;
                }

                await DeleteProductAndInventoryDocument(productDoc, inventoryDoc);
                CosmosDbUtils.AddResponse(
                    batchDeletionResult: result,
                    responseOrder: currOrder,
                    responseData: productDTO,
                    statusCode: 204
                );

                _logger.LogInformation($"Deleted category with id: {id}");
            }

            return result;
        }


        private async Task DeleteProductAndInventoryDocument(ProductDocument productDoc, InventoryDocument inventoryDoc)
        {
            List<PatchOperation> operations = new List<PatchOperation>()
                {
                    PatchOperation.Replace("/isDeleted", true)
                };

            await _productContainer.PatchItemAsync<dynamic>(productDoc.Id, new PartitionKey(productDoc.Sku), operations);
            await _inventoryContainer.PatchItemAsync<dynamic>(inventoryDoc.Id, new PartitionKey(inventoryDoc.Sku), operations);

            await _activityLogRepository.LogActivity(
                    Enums.ActivityType.delete,
                    _userContextService.Current.StaffId,
                    "Sản phẩm",
                    productDoc.ProductId
                );
        }


        private async Task PopulateDataToNewDocument(ProductDocument productDoc, InventoryDocument inventoryDoc)
        {
            _defaultCategoryDoc ??= await GetDefaultCategoryDocument();
            var productId = await GetNewProductIdAsync();

            productDoc.Id = productId;
            productDoc.ProductId = productId;
            productDoc.CategoryId ??= _defaultCategoryDoc.Id;
            productDoc.CategoryName ??= _defaultCategoryDoc.Name;
            productDoc.CategoryText ??= _defaultCategoryDoc.Text;
            productDoc.SalePriceHistory ??= new List<PriceHistory>() 
            { 
                new PriceHistory()
                {
                    Date = DateTime.UtcNow,
                    Value = productDoc.SalePrice
                } 
            };
            productDoc.Description ??= "";
            productDoc.Sku ??= productId;

            inventoryDoc.Id = await GetNewInventoryIdAsync();
            inventoryDoc.ProductId ??= productId;
            inventoryDoc.Sku = productId;
            inventoryDoc.Barcode = productId;
            inventoryDoc.ProductName = productDoc.Name;
            inventoryDoc.Status = DocumentStatusUtils.GetInventoryStatus(
                inventoryDoc.CurrentStock,
                inventoryDoc.MinStock,
                inventoryDoc.MaxStock
            );
            inventoryDoc.LastRestocked = DateTime.UtcNow;
        }

        private async Task<string> GetNewProductIdAsync()
        {
            if (_memoryCache.TryGetValue(cacheProductNewIdName, out string? lastestId))
            {
                if (!String.IsNullOrEmpty(lastestId))
                    return lastestId;
            }

            // Query the database to get the latest product ID
            QueryDefinition queryDef = new QueryDefinition(
                query: 
                "SELECT TOP 1 p.id " +
                "FROM p " +
                "ORDER BY p.id DESC"
            );

            string currLastestId = (await CosmosDbUtils.GetDocumentByQueryDefinition<ResponseToGetId>(_productContainer, queryDef))!.Id;
            string newId = IdUtils.IncreaseId(currLastestId);

            _memoryCache.Set(cacheProductNewIdName, newId);
            return newId;
        }

        private async Task<string> GetNewInventoryIdAsync()
        {
            if (_memoryCache.TryGetValue(cacheInventoryNewIdName, out string? lastestId))
            {
                if (!String.IsNullOrEmpty(lastestId))
                    return lastestId;
            }

            // Query the database to get the latest product ID
            QueryDefinition queryDef = new QueryDefinition(
                query: 
                "SELECT TOP 1 i.id " +
                "FROM i " +
                "ORDER BY i.id DESC"
            );

            string currLastestId = (await CosmosDbUtils.GetDocumentByQueryDefinition<ResponseToGetId>(_inventoryContainer, queryDef))!.Id;
            string newId = IdUtils.IncreaseId(currLastestId);

            _memoryCache.Set(cacheInventoryNewIdName, newId);
            return newId;
        }

        private async Task<IEnumerable<InventoryDocument>> GetInventoryDocumentsAsync(QueryParameters queryParams, ProductFilterModel filter)
        {
            var queryDef = CosmosDbUtils.BuildQuery<InventoryDocument>(queryParams, filter);

            var results = await CosmosDbUtils.GetDocumentsByQueryDefinition<InventoryDocument>(_inventoryContainer, queryDef);

            return results;
        }

        private async Task<IEnumerable<ProductDocument>> GetProductDocumentsAsync(QueryParameters queryParams, ProductFilterModel filter)
        {
            try
            {
                filter = await PopulateFilterValueAsync(filter);
            }
            catch (Exception ex)
            {
                _logger.LogError("Exception in GetProductDocumentAsync: " + ex.Message);
                return Enumerable.Empty<ProductDocument>();
            }


            filter.Query ??= "*";
            var options = AzureSearchUtils.BuildOptions(queryParams, filter);
            var searchResult = await _searchService.SearchAsync<ProductDocument>(filter.Query, options);
            TotalCount = searchResult.TotalCount;
            return searchResult.Results;
        }

        private async Task<CategoryDocument> GetDefaultCategoryDocument()
        {
            var getDefaultCategoryQueryDef = new QueryDefinition(
                   query:
                   "SELECT * " +
                   "FROM c " +
                   "WHERE c.id = @id"
               ).WithParameter("@id", "cate00000");

            var result = (await CosmosDbUtils.GetDocumentByQueryDefinition<CategoryDocument>(_categoryContainer, getDefaultCategoryQueryDef))!;

            return result;
        }

        private async Task<ProductFilterModel> PopulateFilterValueAsync(ProductFilterModel filter)
        {
            if (!VariableHelpers.IsNull(filter.AuthorIds))
            {
                var authorList = (await GetDetailsAsync("author"))?.ToList();
                if (authorList != null)
                {
                    filter.Authors = authorList.Where((_, index) => filter.AuthorIds!.Contains(index)).ToList();
                }
            }

            if (!VariableHelpers.IsNull(filter.ManufacturerIds))
            {
                var manufacturerList = (await GetDetailsAsync("manufacturer"))?.ToList();
                if (manufacturerList != null)
                {
                    filter.Manufacturers = manufacturerList.Where((_, index) => filter.ManufacturerIds!.Contains(index)).ToList();
                }
            }

            if (!VariableHelpers.IsNull(filter.PublisherIds))
            {
                var publisherList = (await GetDetailsAsync("publisher"))?.ToList();
                if (publisherList != null)
                {
                    filter.Publishers = publisherList.Where((_, index) => filter.PublisherIds!.Contains(index)).ToList();
                }
            }

            return filter;
        }

        public async Task<IEnumerable<ProductDocument>> GetProductDocumentsInCategoryAsync(string categoryId)
        {
            var queryDef = new QueryDefinition(
                query: 
                "SELECT * " +
                "FROM products p " +
                "WHERE p.categoryId = @categoryId"
            ).WithParameter("@categoryId", categoryId);

            var results = await CosmosDbUtils.GetDocumentsByQueryDefinition<ProductDocument>(_productContainer, queryDef);

            return results;
        }

        public async Task<ProductDTO> GetProductDTOBySkuAsync(string sku)
        {
            var productDoc = await GetProductDocumentBySkuAsync(sku);
            CheckForNull(productDoc);

            var inventoryDoc = await GetInventoryDocumentBySkuASync(sku);
            CheckForNull(inventoryDoc);


            var result = _mapper.Map<ProductDTO>((productDoc, inventoryDoc));

            return result;
        }

        private async Task<ProductDocument> GetProductDocumentBySkuAsync(string sku)
        {
            var queryDef = new QueryDefinition(
                query: "SELECT * " +
                "FROM p " +
                "WHERE p.sku = @sku AND p.isDeleted = false"
            ).WithParameter("@sku", sku);

            var result = await CosmosDbUtils.GetDocumentByQueryDefinition<ProductDocument>(_productContainer, queryDef);

            CheckForNull(result);

            return result!;
        }

        private async Task<InventoryDocument> GetInventoryDocumentBySkuASync(string sku)
        {
            var queryDef = new QueryDefinition(
                query: "SELECT * " +
                "FROM i " +
                "WHERE i.sku = @sku and i.isDeleted = false"
            ).WithParameter("@sku", sku);

            var result = await CosmosDbUtils.GetDocumentByQueryDefinition<InventoryDocument>(_inventoryContainer, queryDef);

            _logger.LogInformation("curr sku: " + sku);
            CheckForNull(result);

            return result!;
        }

        private async Task<ProductDocument> GetProductDocumentByIdAsync(string id)
        {
            var queryDef = new QueryDefinition(
                query: "SELECT * " +
                "FROM products p " +
                "WHERE p.id = @id and p.isDeleted = false"
            ).WithParameter("@id", id);

            var result = await CosmosDbUtils.GetDocumentByQueryDefinition<ProductDocument>(_productContainer, queryDef);


            CheckForNull(result);

            return result!;
        }

        private async Task<InventoryDocument?> GetInventoryDocumentByProductIdAsync(string productId)
        {
            var queryDef = new QueryDefinition(
                query: 
                "SELECT * " +
                "FROM i " +
                "WHERE i.productId = @productId and i.isDeleted=false"
            ).WithParameter("@productId", productId);

            var result = await CosmosDbUtils.GetDocumentByQueryDefinition<InventoryDocument>(_inventoryContainer, queryDef);

            return result;
        }

        private void CheckForNull<TDocument>(TDocument? document)
        {
            if (document == null) throw new ArgumentNullException(nameof(document));
        }


        // code make private after final production
        private async Task<ItemResponse<InventoryDocument>> AddInventoryDocumentAsync(InventoryDocument item)
        {
            item.CreatedAt = DateTime.UtcNow;
            item.ModifiedAt = item.CreatedAt;

            return await _inventoryContainer.UpsertItemAsync(
                item: item,
                partitionKey: new PartitionKey(item.Sku)
            );


            //_logger.LogInformation($"Inventory with id {item.Id} added");
        }

        private async Task<ItemResponse<ProductDocument>> AddProductDocumentAsync(ProductDocument item)
        {
            item.CreatedAt = DateTime.UtcNow;
            item.ModifiedAt = item.CreatedAt;

            return await _productContainer.UpsertItemAsync(
                item: item,
                partitionKey: new PartitionKey(item.Sku)
            );

            //_logger.LogInformation($"Product with id {item.Id} added");
        }
    }
}
