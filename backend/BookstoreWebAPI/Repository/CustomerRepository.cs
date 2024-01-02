﻿using AutoMapper;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Caching.Memory;
using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Repository.Interfaces;
using BookstoreWebAPI.Utils;
using BookstoreWebAPI.Models.Responses;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Exceptions;

namespace BookstoreWebAPI.Repository
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly string customerNewIdCacheName = "LastestCustomerId";

        private readonly ILogger<CustomerRepository> _logger;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _memoryCache;
        private Container _customerContainer;

        public CustomerRepository(CosmosClient cosmosClient, IMapper mapper, IMemoryCache memoryCache, ILogger<CustomerRepository> logger)
        {
            var databaseName = cosmosClient.ClientOptions.ApplicationName;
            var containerName = "customers";

            _customerContainer = cosmosClient.GetContainer(databaseName, containerName);
            _mapper = mapper;
            _memoryCache = memoryCache;
            _logger = logger;
        }

        public async Task<int> GetTotalCount(QueryParameters queryParams, CustomerFilterModel filter)
        {
            var tempQueryParams = new QueryParameters()
            {
                PageNumber = queryParams.PageNumber,
                PageSize = -1
            };

            tempQueryParams.PageSize = -1;

            var queryDef = CosmosDbUtils.BuildQuery<CustomerDocument>(tempQueryParams, filter);

            var customerDocs = await CosmosDbUtils.GetDocumentsByQueryDefinition<CustomerDocument>(_customerContainer, queryDef);

            var count = customerDocs.Count();

            return count;
        }

        public async Task<IEnumerable<CustomerDTO>> GetCustomerDTOsAsync(QueryParameters queryParams, CustomerFilterModel filter)
        {
            var queryDef = CosmosDbUtils.BuildQuery<CustomerDocument>(queryParams);

            var customerDocs = await CosmosDbUtils.GetDocumentsByQueryDefinition<CustomerDocument>(_customerContainer, queryDef);
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
                return _mapper.Map<CustomerDTO>(createdDocument.Resource);
            }

            throw new ArgumentNullException(nameof(createdDocument));
        }

        public async Task UpdateCustomerDTOAsync(CustomerDTO customerDTO)
        {
            var customerToUpdate = _mapper.Map<CustomerDocument>(customerDTO);

            await _customerContainer.UpsertItemAsync(
                item: customerToUpdate,
                partitionKey: new PartitionKey(customerToUpdate.CustomerId)
            );
        }

        public async Task<BatchDeletionResult<CustomerDTO>> DeleteCustomerDTOsAsync(string[] ids)
        {
            BatchDeletionResult<CustomerDTO> result = new()
            {
                Responses = new(),
                IsSuccessful = true,
                IsForbidden = true,
                IsNotFound = true
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

                _logger.LogInformation($"Deleted customer with id: {id}");
            }

            return result;

            // code to update the product in background using function
        }

        private async Task DeleteCustomer(CustomerDocument customerDoc)
        {
            List<PatchOperation> patchOperations = new()
            {
                PatchOperation.Replace("/isDeleted", true)
            };

            await _customerContainer.PatchItemAsync<CustomerDocument>(customerDoc.Id, new PartitionKey(customerDoc.CustomerId), patchOperations);
        }

        private async Task PopulateDataToNewCustomerDocument(CustomerDocument customerDoc)
        {
            customerDoc.Id = await GetNewCustomerIdAsync();
            customerDoc.CustomerId = customerDoc.Id;

            customerDoc.Email ??= "";
            customerDoc.PhoneNumber ??= "";
            customerDoc.SalesOrderInformation ??= new();
            customerDoc.Address ??= new()
            {
                Address = "",
                Email = "",
                Name = "",
                PhoneNumber = ""
            };

            customerDoc.Type ??= "Retail";
            customerDoc.Note ??= "";
            customerDoc.Tags ??= new();
        }

        public async Task<ItemResponse<CustomerDocument>> AddCustomerDocumentAsync(CustomerDocument item)
        {
            item.CreatedAt = DateTime.UtcNow;

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
