using AutoMapper;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Caching.Memory;
using SE100_BookstoreWebAPI.Models.Documents;
using SE100_BookstoreWebAPI.Models.DTOs;
using SE100_BookstoreWebAPI.Repository.Interfaces;
using SE100_BookstoreWebAPI.Utils;

namespace SE100_BookstoreWebAPI.Repository
{
    public class ProductRepository : IProductRepository
    {
        private readonly ILogger<CategoryRepository> _logger;
        private readonly IMemoryCache _memoryCache;
        private readonly IMapper _mapper;
        private readonly Container _productContainer;
        private readonly Container _inventoryContainer;

        public ProductRepository(CosmosClient cosmosClient, ILogger<CategoryRepository> logger, IMemoryCache memoryCache, IMapper mapper)
        {
            this._logger = logger;
            this._memoryCache = memoryCache;
            this._mapper = mapper;
            var databaseName = cosmosClient.ClientOptions.ApplicationName;

            _productContainer = cosmosClient.GetContainer(databaseName, "products"); 
            _inventoryContainer = cosmosClient.GetContainer(databaseName, "inventory");
        }

        public async Task AddInventoryDocumentAsync(InventoryDocument item)
        {
            await _inventoryContainer.UpsertItemAsync(
                item: item,
                partitionKey: new PartitionKey(item.Sku)
            );


            _logger.LogInformation($"Inventory with id {item.Id} added");
        }

        public async Task AddProductDocumentAsync(ProductDocument item)
        {
            await _productContainer.UpsertItemAsync(
                item: item,
                partitionKey: new PartitionKey(item.Sku)
            );

            _logger.LogInformation($"Product with id {item.Id} added");
        }

        public async Task AddProductDTOAsync(ProductDTO productDTO)
        {
            var productDoc = _mapper.Map<ProductDocument>(productDTO);
            var inventoryDoc = _mapper.Map<InventoryDocument>(productDTO);

            inventoryDoc.Id = await GetNewInventoryIdAsync();
            productDoc.IsDeleted = false;
            inventoryDoc.IsDeleted = false;

            _memoryCache.Set("LatestInventoryId", IdUtils.IncreaseId(inventoryDoc.Id));
            _memoryCache.Set("LatestProductId", IdUtils.IncreaseId(productDoc.Id));

            await AddInventoryDocumentAsync(inventoryDoc);
            await AddProductDocumentAsync(productDoc);

            _logger.LogInformation($"Product and inventory with id {productDoc.Id} added");
        }


        public async Task UpdateProductDTOAsync(ProductDTO productDTO)
        {
            var productDoc = _mapper.Map<ProductDocument>(productDTO);
            var inventoryDoc = _mapper.Map<InventoryDocument>(productDTO);
            var inventoryDocInDb = await GetInventoryDocumentByProductIdAsync(inventoryDoc.Id);
            inventoryDoc.Id = inventoryDocInDb.Id;
            inventoryDoc.LastRestocked = inventoryDocInDb.LastRestocked;

            await AddInventoryDocumentAsync(inventoryDoc);
            await AddProductDocumentAsync(productDoc);

            _logger.LogInformation($"Product and inventory with id {productDoc.Id} added");
        }

        public async Task<string> GetNewProductIdAsync()
        {
            if (_memoryCache.TryGetValue("LatestProductId", out string? lastestId))
            {
                if (!String.IsNullOrEmpty(lastestId))
                    return lastestId;
            }

            // Query the database to get the latest product ID
            QueryDefinition queryDef = new QueryDefinition(
                query: 
                "SELECT TOP 1 p.id " +
                "FROM p " +
                "WHERE p.isDeleted = false " +
                "ORDER BY p.id DESC"
            );

            //using var feed = _productContainer.GetItemQueryIterator<ResponseToGetId>(
            //    queryDefinition: queryDef
            //);
            //var response = await feed.ReadNextAsync();
            //LogRequestCharged(response.RequestCharge);

            //lastestId = response.First().Id;

            string currLastestId = (await CosmosDbUtils.GetDocumentByQueryDefinition<ResponseToGetId>(_productContainer, queryDef))!.Id;
            string newId = IdUtils.IncreaseId(currLastestId);

            _memoryCache.Set("LatestProductId", newId);
            return newId;
        }

        public async Task<string> GetNewInventoryIdAsync()
        {
            if (_memoryCache.TryGetValue("LatestInventoryId", out string? lastestId))
            {
                if (!String.IsNullOrEmpty(lastestId))
                    return lastestId;
            }

            // Query the database to get the latest product ID
            QueryDefinition queryDef = new QueryDefinition(
                query: 
                "SELECT TOP 1 i.id " +
                "FROM i " +
                "WHERE i.isDeleted = false " +
                "ORDER BY i.id DESC"
            );

            //using var feed = _inventoryContainer.GetItemQueryIterator<ResponseToGetId>(
            //    queryDefinition: queryDef
            //);
            //var response = await feed.ReadNextAsync();
            //LogRequestCharged(response.RequestCharge);

            //lastestId = response.First().Id;
            string currLastestId = (await CosmosDbUtils.GetDocumentByQueryDefinition<ResponseToGetId>(_inventoryContainer, queryDef))!.Id;
            string newId = IdUtils.IncreaseId(currLastestId);

            _memoryCache.Set("LatestInventoryId", newId);
            return newId;
        }

        public async Task<IEnumerable<InventoryDocument>> GetInventoryDocumentsAsync()
        {
            var queryDef = new QueryDefinition(
                query: 
                "SELECT * FROM i " +
                "WHERE i.isDeleted = false"
            );

            var results = await CosmosDbUtils.GetDocumentsByQueryDefinition<InventoryDocument>(_inventoryContainer, queryDef);

            return results;
        }

        public async Task<IEnumerable<ProductDocument>> GetProductDocumentsAsync()
        {
            var queryDef = new QueryDefinition(
                query: 
                "SELECT * " +
                "FROM products p " +
                "WHERE p.isDeleted = false"
            );

            var results = await CosmosDbUtils.GetDocumentsByQueryDefinition<ProductDocument>(_productContainer, queryDef);

            return results;
        }

        public async Task<IEnumerable<ProductDTO>> GetProductDTOsAsync()
        {
            var productDocs = await GetProductDocumentsAsync();
            var inventoryDocs = await GetInventoryDocumentsAsync();

            var productDTOs = productDocs.Select(productDoc =>
            {
                var inventoryDoc = inventoryDocs.FirstOrDefault(inv => inv.ProductId == productDoc.ProductId);
                return _mapper.Map<ProductDTO>((productDoc, inventoryDoc));
            }).ToList();

            return productDTOs;
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


        public async Task<ProductDTO?> GetProductDTOBySkuAsync(string sku)
        {
            var productDoc = await GetProductDocumentBySkuAsync(sku);
            var inventoryDoc = await GetInventoryDocumentBySkuASync(sku);

            var result = _mapper.Map<ProductDTO>((productDoc, inventoryDoc));

            return result;
        }


        private async Task<ProductDocument?> GetProductDocumentBySkuAsync(string sku)
        {
            var queryDef = new QueryDefinition(
                query: "SELECT * " +
                "FROM p " +
                "WHERE p.sku = @sku"
            ).WithParameter("@sku", sku);

            var result = await CosmosDbUtils.GetDocumentByQueryDefinition<ProductDocument>(_productContainer, queryDef);

            return result;
        }

        private async Task<InventoryDocument> GetInventoryDocumentBySkuASync(string sku)
        {
            var queryDef = new QueryDefinition(
                query: "SELECT * " +
                "FROM i " +
                "WHERE i.sku = @sku AND i.isDeleted = false"
            ).WithParameter("@sku", sku);

            var result = await CosmosDbUtils.GetDocumentByQueryDefinition<InventoryDocument>(_inventoryContainer, queryDef);

            return result;
        }

        public async Task<ProductDTO?> GetProductDTOByIdAsync(string id)
        {
            var productDoc = await GetProductDocumentByIdAsync(id);
            var inventoryDoc = await GetInventoryDocumentByProductIdAsync(id);

            var result = _mapper.Map<ProductDTO>((productDoc, inventoryDoc));

            return result;
        }

        private async Task<ProductDocument> GetProductDocumentByIdAsync(string id)
        {
            var queryDef = new QueryDefinition(
                query: "SELECT * " +
                "FROM products p " +
                "WHERE p.id = @id AND p.isDeleted = false"
            ).WithParameter("@id", id);

            var result = await CosmosDbUtils.GetDocumentByQueryDefinition<ProductDocument>(_productContainer, queryDef);

            return result;
        }

        private async Task<InventoryDocument?> GetInventoryDocumentByProductIdAsync(string productId)
        {
            var queryDef = new QueryDefinition(
                query: 
                "SELECT * " +
                "FROM i " +
                "WHERE i.productId = @productId AND i.isDeleted=false"
            ).WithParameter("@productId", productId);

            var result = await CosmosDbUtils.GetDocumentByQueryDefinition<InventoryDocument>(_inventoryContainer, queryDef);

            return result;
        }


        private void LogRequestCharged(double requestCharge)
        {
            _logger.LogInformation($"Request charged: {requestCharge}");
        }

        public async Task DeleteProductDTOAsync(string id)
        {
            var productDoc = await GetProductDocumentByIdAsync(id);
            var inventoryDoc = await GetInventoryDocumentByProductIdAsync(id);

            productDoc.IsDeleted = true;
            inventoryDoc.IsDeleted = true;

            List<PatchOperation> operations = new List<PatchOperation>()
            {
                PatchOperation.Replace("/isDeleted", false)
            };

            await _productContainer.PatchItemAsync<dynamic>(productDoc.Id, new PartitionKey(productDoc.Sku), operations);
            await _inventoryContainer.PatchItemAsync<dynamic>(inventoryDoc.Id, new PartitionKey(inventoryDoc.Sku), operations);
        }
    }
}
