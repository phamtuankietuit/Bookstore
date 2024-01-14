using AutoMapper;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Caching.Memory;
using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Repository.Interfaces;
using BookstoreWebAPI.Utils;
using BookstoreWebAPI.Models.Responses;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Services;
using Azure.Search.Documents.Models;

namespace BookstoreWebAPI.Repository
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly string customerNewIdCacheName = "LastestCustomerId";

        private readonly ILogger<CustomerRepository> _logger;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _memoryCache;
        private readonly IActivityLogRepository _activityLogRepository;
        private Container _customerContainer;
        private readonly UserContextService _userContextService;
        private readonly AzureSearchClientService _searchService;
        private readonly IndexDocumentsBatch<SearchDocument> _customerBatch;

        public int TotalCount {  get; private set; }

        public CustomerRepository(
            CosmosClient cosmosClient,
            IMapper mapper,
            IMemoryCache memoryCache,
            ILogger<CustomerRepository> logger,
            IActivityLogRepository activityLogRepository,
            UserContextService userContextService,
            AzureSearchServiceFactory searchServiceFactory)
        {
            var databaseName = cosmosClient.ClientOptions.ApplicationName;
            var containerName = "customers";

            _customerContainer = cosmosClient.GetContainer(databaseName, containerName);
            _searchService = searchServiceFactory.Create(containerName);

            _mapper = mapper;
            _memoryCache = memoryCache;
            _logger = logger;
            _activityLogRepository = activityLogRepository;
            _userContextService = userContextService;
            _customerBatch = new();
        }

        public async Task<IEnumerable<CustomerDTO>> GetCustomerDTOsAsync(QueryParameters queryParams, CustomerFilterModel filter)
        {
            IEnumerable<CustomerDocument?> customerDocs = [];

            if (filter.Query == null)
            {
                var queryDef = CosmosDbUtils.BuildQuery(queryParams, filter);
                customerDocs = await CosmosDbUtils.GetDocumentsByQueryDefinition<CustomerDocument>(_customerContainer, queryDef);
                TotalCount = customerDocs == null ? 0: customerDocs.Count();
                
                if (queryParams.PageSize != -1)
                {
                    queryParams.PageSize = -1;
                    var queryDefGetAll = CosmosDbUtils.BuildQuery(queryParams, filter);
                    var allCustomerDocs = await CosmosDbUtils.GetDocumentsByQueryDefinition<CustomerDocument>(_customerContainer, queryDefGetAll);
                    TotalCount = allCustomerDocs == null ? 0: allCustomerDocs.Count();
                }
            }
            else
            {
                var options = AzureSearchUtils.BuildOptions(queryParams, filter);
                var searchResult = await _searchService.SearchAsync<CustomerDocument>(filter.Query, options);
                TotalCount = searchResult.TotalCount;
                customerDocs = searchResult.Results;
            }

            var customerDTOs = customerDocs.Select(customerDoc =>
            {
                return _mapper.Map<CustomerDTO>(customerDoc);
            }).ToList();

            return customerDTOs;
        }

        public async Task<CustomerDTO?> GetCustomerDTOByIdAsync(string id)
        {
            var customerDoc = await GetCustomerDocumentByIdAsync(id);

            var customerDTO = _mapper.Map<CustomerDTO>(customerDoc);

            return customerDTO;
        }

        public async Task<CustomerDTO> AddCustomerDTOAsync(CustomerDTO customerDTO)
        {
            // validation for uniqueness

            var customerDoc = _mapper.Map<CustomerDocument>(customerDTO);
            await PopulateDataToNewCustomerDocument(customerDoc);

            var createdDocument = await AddCustomerDocumentAsync(customerDoc);
            if (createdDocument.StatusCode == System.Net.HttpStatusCode.Created)
            {
                _memoryCache.Set(customerNewIdCacheName, IdUtils.IncreaseId(customerDoc.Id));

                await _activityLogRepository.LogActivity(
                    Enums.ActivityType.create,
                    _userContextService.Current.StaffId,
                    "Sản phẩm",
                    customerDoc.CustomerId
                );

                _searchService.InsertToBatch(_customerBatch, createdDocument.Resource, BatchAction.Upload);
                await _searchService.ExecuteBatchIndex(_customerBatch);

                _logger.LogInformation($"[CustomerRepository] Uploaded new customer {createdDocument.Resource.Id} to index");


                return _mapper.Map<CustomerDTO>(createdDocument.Resource);
            }

            throw new ArgumentNullException(nameof(createdDocument));
        }
         
        public async Task UpdateCustomerDTOAsync(CustomerDTO customerDTO)
        {
            var customerToUpdate = _mapper.Map<CustomerDocument>(customerDTO);
            customerToUpdate.ModifiedAt = DateTime.UtcNow;

            await _customerContainer.UpsertItemAsync(
                item: customerToUpdate,
                partitionKey: new PartitionKey(customerToUpdate.CustomerId)
            );

            await _activityLogRepository.LogActivity(
                Enums.ActivityType.update,
                _userContextService.Current.StaffId,
                "Sản phẩm",
                customerToUpdate.CustomerId
            );

            _searchService.InsertToBatch(_customerBatch, customerToUpdate, BatchAction.Merge);
            await _searchService.ExecuteBatchIndex(_customerBatch);

            _logger.LogInformation($"[CustomerRepository] Merged uploaded customer {customerToUpdate.Id} to index");

        }

        public async Task<BatchDeletionResult<CustomerDTO>> DeleteCustomerDTOsAsync(string[] ids)
        {
            BatchDeletionResult<CustomerDTO> result = new()
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
                var customerDoc = await GetCustomerDocumentByIdAsync(id);
                var customerDTO = _mapper.Map<CustomerDTO>(customerDoc);

                // Handle case where supplierDoc is null
                if (customerDoc == null)
                {
                    CosmosDbUtils.AddResponse(
                        batchDeletionResult: result,
                        responseOrder: currOrder,
                        responseData: customerDTO,
                        statusCode: 404
                    );
                    continue;
                }

                // Handle case where supplierDoc is not removable
                if (!customerDoc.IsRemovable)
                {
                    CosmosDbUtils.AddResponse(
                        batchDeletionResult: result,
                        responseOrder: currOrder,
                        responseData: customerDTO,
                        statusCode: 403
                    );
                    continue;
                }

                // Delete the supplier
                await DeleteCustomer(customerDoc);
                CosmosDbUtils.AddResponse(
                    batchDeletionResult: result,
                    responseOrder: currOrder,
                    responseData: customerDTO,
                    statusCode: 204
                );

                _searchService.InsertToBatch(_customerBatch, customerDoc, BatchAction.Merge);


                _logger.LogInformation($"Deleted customer with id: {id}");
            }

            await _searchService.ExecuteBatchIndex(_customerBatch);

            _logger.LogInformation($"[CustomerRepository] Merged deleted categories into index, count: {_customerBatch.Actions.Count}");

            return result;

            // code to update the product in background using function
        }

        private async Task DeleteCustomer(CustomerDocument customerDoc)
        {
            customerDoc.IsDeleted = true;
            List<PatchOperation> patchOperations = new()
            {
                PatchOperation.Replace("/isDeleted", true)
            };

            await _customerContainer.PatchItemAsync<CustomerDocument>(customerDoc.Id, new PartitionKey(customerDoc.CustomerId), patchOperations);
            
            await _activityLogRepository.LogActivity(
                Enums.ActivityType.delete,
                _userContextService.Current.StaffId,
                "Sản phẩm",
                customerDoc.CustomerId
            );
        }

        private async Task PopulateDataToNewCustomerDocument(CustomerDocument customerDoc)
        {
            customerDoc.Id = await GetNewCustomerIdAsync();
            customerDoc.CustomerId = customerDoc.Id;

            customerDoc.Email ??= "";
            customerDoc.PhoneNumber ??= "";
            customerDoc.SalesOrderInformation ??= new();
            customerDoc.Address ??= "";

            customerDoc.Type ??= "Retail";
            customerDoc.Note ??= "";
            customerDoc.Tags ??= new();
        }

        private async Task<ItemResponse<CustomerDocument>> AddCustomerDocumentAsync(CustomerDocument item)
        {
            item.CreatedAt = DateTime.UtcNow;
            item.ModifiedAt = item.CreatedAt;


            return await _customerContainer.UpsertItemAsync(
                item: item,
                partitionKey: new PartitionKey(item.CustomerId)
            );
        }

        public async Task<string> GetNewCustomerIdAsync()
        {
            if (_memoryCache.TryGetValue(customerNewIdCacheName, out string? lastestId))
            {
                if (!string.IsNullOrEmpty(lastestId))
                    return lastestId;
            }

            // Query the database to get the latest product ID
            QueryDefinition queryDef = new QueryDefinition(
                query:
                "SELECT TOP 1 po.id " +
                "FROM po " +
                "ORDER BY po.id DESC"
            );

            string currLastestId = (await CosmosDbUtils.GetDocumentByQueryDefinition<ResponseToGetId>(_customerContainer, queryDef))!.Id;
            string newId = IdUtils.IncreaseId(currLastestId);

            _memoryCache.Set(customerNewIdCacheName, newId);
            return newId;
        }

        private async Task<CustomerDocument?> GetCustomerDocumentByIdAsync(string id)
        {
            var queryDef = new QueryDefinition(
                query:
                    "SELECT * " +
                    "FROM po " +
                    "WHERE po.id = @id"
            ).WithParameter("@id", id);

            var customer = await CosmosDbUtils.GetDocumentByQueryDefinition<CustomerDocument>(_customerContainer, queryDef);

            return customer;
        }
    }
}
