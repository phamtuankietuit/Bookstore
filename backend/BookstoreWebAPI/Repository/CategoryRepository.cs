using AutoMapper;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Caching.Memory;
using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Repository.Interfaces;
using BookstoreWebAPI.Utils;
using System.Data;
using BookstoreWebAPI.Exceptions;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.Responses;
using BookstoreWebAPI.Services;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using Azure.Search.Documents.Models;

namespace BookstoreWebAPI.Repository
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly string categoryNewIdCacheName = "LastestCategoryId";

        private readonly ILogger<CategoryRepository> _logger;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _memoryCache;
        private Container _categoryContainer;
        private readonly IActivityLogRepository _activityLogRepository;
        private readonly UserContextService _userContextService;
        private readonly AzureSearchClientService _searchService;
        private readonly IndexDocumentsBatch<SearchDocument> _categoryBatch;

        public int TotalCount { get; set; }

        public CategoryRepository(
            CosmosClient cosmosClient,
            ILogger<CategoryRepository> logger,
            IMapper mapper,
            IMemoryCache memoryCache,
            IActivityLogRepository activityLogRepository,
            UserContextService userContextService,
            AzureSearchServiceFactory searchServiceFactory)
        {
            var databaseName = cosmosClient.ClientOptions.ApplicationName;
            var containerName = "categories";

            _logger = logger;
            _mapper = mapper;
            _memoryCache = memoryCache;
            _activityLogRepository = activityLogRepository;
            _userContextService = userContextService;

            _categoryBatch = new();
            _categoryContainer = cosmosClient.GetContainer(databaseName, containerName);
            _searchService = searchServiceFactory.Create(containerName);

        }

        public async Task<IEnumerable<CategoryDTO>> GetCategoryDTOsAsync(QueryParameters queryParams, CategoryFilterModel filter)
        {
            IEnumerable<CategoryDocument?> categoryDocs = [];

            if (filter.Query == null)
            {
                var queryDef = CosmosDbUtils.BuildQuery(queryParams, filter);
                categoryDocs = await CosmosDbUtils.GetDocumentsByQueryDefinition<CategoryDocument>(_categoryContainer, queryDef);
                TotalCount = categoryDocs == null ? 0 : categoryDocs.Count();

                if (queryParams.PageSize != -1)
                {
                    queryParams.PageSize = -1;
                    var queryDefGetAll = CosmosDbUtils.BuildQuery(queryParams, filter);
                    var allCategoryDocs = await CosmosDbUtils.GetDocumentsByQueryDefinition<CategoryDocument>(_categoryContainer, queryDefGetAll);
                    TotalCount = allCategoryDocs == null ? 0 : allCategoryDocs.Count();
                }
            }
            else
            {
                var options = AzureSearchUtils.BuildOptions(queryParams, filter);
                var searchResult = await _searchService.SearchAsync<CategoryDocument>(filter.Query, options);
                TotalCount = searchResult.TotalCount;
                categoryDocs = searchResult.Results;
            }

            var categoryDTOs = categoryDocs.Select(categoryDoc =>
            {
                return _mapper.Map<CategoryDTO>(categoryDoc);
            }).ToList();

            return categoryDTOs;
        }

        public async Task<CategoryDTO?> GetCategoryDTOByIdAsync(string id)
        {
            var categoryDoc = await GetCategoryDocumentByIdAsync(id);

            var categoryDTO = _mapper.Map<CategoryDTO>(categoryDoc);

            return categoryDTO;
        }

        public async Task<CategoryDTO> AddCategoryDTOAsync(CategoryDTO categoryDTO)
        {
            if (await NameExistsInContainer(StringUtils.RemoveAccentsAndHyphenize(categoryDTO.Text)))
            {
                throw new DuplicateDocumentException($"The category {categoryDTO.Text} has already been created. Please choose a different name.");
            }

            var categoryDoc = _mapper.Map<CategoryDocument>(categoryDTO);
            await PopulateDataToNewCategoryDocument(categoryDoc);

            var createdDocument = await AddCategoryDocumentAsync(categoryDoc);
            if (createdDocument.StatusCode == System.Net.HttpStatusCode.Created)
            {
                _memoryCache.Set(categoryNewIdCacheName, IdUtils.IncreaseId(categoryDoc.Id));

                await _activityLogRepository.LogActivity(
                    Enums.ActivityType.create,
                    _userContextService.Current.StaffId,
                    "Loại sản phẩm",
                    categoryDTO.CategoryId
                );

                _searchService.InsertToBatch(_categoryBatch, createdDocument.Resource, BatchAction.Upload);
                await _searchService.ExecuteBatchIndex(_categoryBatch);
                
                _logger.LogInformation($"[CategoryRepository] Uploaded new category {createdDocument.Resource.Id} to index");


                return _mapper.Map<CategoryDTO>(createdDocument.Resource);
            }

            throw new ArgumentNullException(nameof(createdDocument));
        }

        public async Task UpdateCategoryDTOAsync(CategoryDTO item)
        {
            if (await NameExistsInContainer(StringUtils.RemoveAccentsAndHyphenize(item.Text)))
            {
                throw new DuplicateDocumentException($"The category {item.Text} has already been created. Please choose a different name.");
            }

            var categoryToUpdate = _mapper.Map<CategoryDocument>(item);
            categoryToUpdate.Name = StringUtils.RemoveAccentsAndHyphenize(item.Text);
            categoryToUpdate.ModifiedAt = DateTime.UtcNow;

            await _categoryContainer.UpsertItemAsync(
                item: categoryToUpdate,
                partitionKey: new PartitionKey(categoryToUpdate.CategoryId)
            );

            await _activityLogRepository.LogActivity(
                    Enums.ActivityType.update,
                    _userContextService.Current.StaffId,
                    "Loại sản phẩm",
                    categoryToUpdate.CategoryId
                );

            _searchService.InsertToBatch(_categoryBatch, categoryToUpdate, BatchAction.Merge);
            await _searchService.ExecuteBatchIndex(_categoryBatch);

            _logger.LogInformation($"[CategoryRepository] Merged uploaded category {categoryToUpdate.Id} to index");

            // Change feed to update products
        }
        public async Task<BatchDeletionResult<CategoryDTO>> DeleteCategoriesAsync(string[] ids)
        {
            BatchDeletionResult<CategoryDTO> result = new()
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
                var categoryDoc = await GetCategoryDocumentByIdAsync(id);
                var categoryDTO = _mapper.Map<CategoryDTO>(categoryDoc);

                // Handle case where supplierDoc is null
                if (categoryDoc == null)
                {
                    CosmosDbUtils.AddResponse(
                        batchDeletionResult: result,
                        responseOrder: currOrder,
                        responseData: categoryDTO,
                        statusCode: 404
                    );
                    continue;
                }

                // Handle case where supplierDoc is not removable
                if (!categoryDoc.IsRemovable)
                {
                    CosmosDbUtils.AddResponse(
                        batchDeletionResult: result,
                        responseOrder: currOrder,
                        responseData: categoryDTO,
                        statusCode: 403
                    );
                    continue;
                }

                // Delete the supplier
                await DeleteCategory(categoryDoc);
                CosmosDbUtils.AddResponse(
                    batchDeletionResult: result,
                    responseOrder: currOrder,
                    responseData: categoryDTO,
                    statusCode: 204
                );

                _searchService.InsertToBatch(_categoryBatch, categoryDoc, BatchAction.Merge);


                _logger.LogInformation($"Deleted category with id: {id}");
            }

            await _searchService.ExecuteBatchIndex(_categoryBatch);

            _logger.LogInformation($"[CategoryRepository] Merged deleted categories into index, count: {_categoryBatch.Actions.Count}");
            
            return result;

            // code to update the product in background using function
        }
        
        private async Task<bool> NameExistsInContainer(string categoryName)
        {
            var queryDef = new QueryDefinition(
                "SELECT * " +
                "FROM c " +
                "WHERE c.isDeleted = false AND STRINGEQUALS(@categoryName,c.name,true)"
            ).WithParameter("@categoryName", categoryName);

            var result = await CosmosDbUtils.GetDocumentByQueryDefinition<CategoryDocument>(_categoryContainer, queryDef);

            return result != null;
        }
        
        private async Task PopulateDataToNewCategoryDocument(CategoryDocument categoryDoc)
        {
            categoryDoc.Id = await GetNewCategoryIdAsync();
            categoryDoc.CategoryId = categoryDoc.Id;
            categoryDoc.Name = StringUtils.RemoveAccentsAndHyphenize(categoryDoc.Text);
            categoryDoc.IsRemovable = true;
            categoryDoc.IsDeleted = false;
        }

        private async Task<string> GetNewCategoryIdAsync()
        {
            if (_memoryCache.TryGetValue(categoryNewIdCacheName, out string? lastestId))
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

            _memoryCache.Set(categoryNewIdCacheName, newId);
            return newId;
        }

        private async Task DeleteCategory(CategoryDocument categoryDoc)
        {
            categoryDoc.IsDeleted = true;
            List<PatchOperation> patchOperations = new()
            {
                PatchOperation.Replace("/isDeleted", true)
            };

            await _categoryContainer.PatchItemAsync<CategoryDocument>(categoryDoc.Id, new PartitionKey(categoryDoc.CategoryId), patchOperations);

            await _activityLogRepository.LogActivity(
                    Enums.ActivityType.delete,
                    _userContextService.Current.StaffId,
                    "Loại sản phẩm",
                    categoryDoc.CategoryId
                );
        }

        private async Task<CategoryDocument?> GetCategoryDocumentByIdAsync(string id)
        {
            var queryDef = new QueryDefinition(
                query:
                    "SELECT * " +
                    "FROM c " +
                    "WHERE c.id = @id AND c.isDeleted = false"
            ).WithParameter("@id", id);

            var category = await CosmosDbUtils.GetDocumentByQueryDefinition<CategoryDocument>(_categoryContainer, queryDef);

            return category;
        }

        // for data seeder, private after production
        public async Task<ItemResponse<CategoryDocument>> AddCategoryDocumentAsync(CategoryDocument item)
        {
            try
            {
                item.CreatedAt = DateTime.UtcNow;
                item.ModifiedAt = item.CreatedAt;
                
                var response = await _categoryContainer.UpsertItemAsync(
                    item: item,
                    partitionKey: new PartitionKey(item.CategoryId)
                );

                return response;
            }
            catch (CosmosException)
            {
                // unhandled
                throw new Exception("An exception thrown when creating the purchase order item document");
            }
        }
    }
}
