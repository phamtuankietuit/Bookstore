using AutoMapper;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Caching.Memory;
using SE100_BookstoreWebAPI.Models.Documents;
using SE100_BookstoreWebAPI.Models.DTOs;
using SE100_BookstoreWebAPI.Repository.Interfaces;
using SE100_BookstoreWebAPI.Utils;

namespace SE100_BookstoreWebAPI.Repository
{
    public class CustomerRepository : ICustomerRepository
    {
        private Container _customerContainer;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _memoryCache;

        public CustomerRepository(CosmosClient cosmosClient, IMapper mapper, IMemoryCache memoryCache)
        {
            var databaseName = cosmosClient.ClientOptions.ApplicationName;
            var containerName = "customers";

            _customerContainer = cosmosClient.GetContainer(databaseName, containerName);
            this._mapper = mapper;
            this._memoryCache = memoryCache;
        }

        public async Task AddCustomerDocumentAsync(CustomerDocument item)
        {
            await _customerContainer.UpsertItemAsync(
                item: item,
                partitionKey: new PartitionKey(item.CustomerId)
            );
        }

        public async Task AddCustomerDTOAsync(CustomerDTO customerDTO)
        {
            var customerDoc = _mapper.Map<CustomerDocument>(customerDTO);

            await AddCustomerDocumentAsync(customerDoc);
        }
        public async Task UpdateCustomerAsync(CustomerDTO customerDTO)
        {
            var customerToUpdate = _mapper.Map<CustomerDocument>(customerDTO);

            await _customerContainer.UpsertItemAsync(
                item: customerToUpdate,
                partitionKey: new PartitionKey(customerToUpdate.CustomerId)
            );
        }

        public async Task<IEnumerable<CustomerDTO>> GetCustomerDTOsAsync()
        {
            var queryDef = new QueryDefinition(
                query:
                    "SELECT * " +
                    "FROM po"
            );

            var customerDocs = await CosmosDbUtils.GetDocumentsByQueryDefinition<CustomerDocument>(_customerContainer, queryDef);
            var customerDTOs = customerDocs.Select(customerDoc =>
            {
                return _mapper.Map<CustomerDTO>(customerDoc);
            }).ToList();

            return customerDTOs;
        }

        public async Task<string> GetNewCustomerIdAsync()
        {
            if (_memoryCache.TryGetValue("LastestCustomerId", out string? lastestId))
            {
                if (!String.IsNullOrEmpty(lastestId))
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

            _memoryCache.Set("LastestCustomerId", newId);
            return newId;
        }

        public async Task<CustomerDTO> GetCustomerDTOByIdAsync(string id)
        {
            var customerDoc = await GetCustomerDocumentByIdAsync(id);

            var customerDTO = _mapper.Map<CustomerDTO>(customerDoc);

            return customerDTO;
        }

        public async Task DeleteCustomerAsync(string id)
        {
            //var customerDoc = await GetCustomerDocumentByIdAsync(id);

            //if (customerDoc == null)
            //{
            //    throw new Exception("Customer Not found!");
            //}

            //List<PatchOperation> patchOperations = new List<PatchOperation>()
            //{
            //    PatchOperation.Replace("/isDeleted", true)
            //};

            //await _customerContainer.PatchItemAsync<CustomerDocument>(id, new PartitionKey(customerDoc.CustomerId), patchOperations);
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
