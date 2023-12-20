using AutoMapper;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Caching.Memory;
using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Repository.Interfaces;
using BookstoreWebAPI.Utils;

namespace BookstoreWebAPI.Repository
{
    public class SupplierRepository : ISupplierRepository
    {
        private Container _supplierContainer;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _memoryCache;

        public SupplierRepository(CosmosClient cosmosClient, IMapper mapper, IMemoryCache memoryCache)
        {
            var databaseName = cosmosClient.ClientOptions.ApplicationName;
            var containerName = "suppliers";

            _supplierContainer = cosmosClient.GetContainer(databaseName, containerName);
            this._mapper = mapper;
            this._memoryCache = memoryCache;
        }

        public async Task AddSupplierDocumentAsync(SupplierDocument item)
        {
            await _supplierContainer.UpsertItemAsync(
                item: item,
                partitionKey: new PartitionKey(item.SupplierId)
            );
        }

        public async Task AddSupplierDTOAsync(SupplierDTO supplierDTO)
        {
            var supplierDoc = _mapper.Map<SupplierDocument>(supplierDTO);

            await AddSupplierDocumentAsync(supplierDoc);
        }
        public async Task UpdateSupplierAsync(SupplierDTO supplierDTO)
        {
            var supplierToUpdate = _mapper.Map<SupplierDocument>(supplierDTO);

            await _supplierContainer.UpsertItemAsync(
                item: supplierToUpdate,
                partitionKey: new PartitionKey(supplierToUpdate.SupplierId)
            );
        }

        public async Task<IEnumerable<SupplierDTO>> GetSupplierDTOsAsync()
        {
            var queryDef = new QueryDefinition(
                query:
                    "SELECT * " +
                    "FROM po"
            );

            var supplierDocs = await CosmosDbUtils.GetDocumentsByQueryDefinition<SupplierDocument>(_supplierContainer, queryDef);
            var supplierDTOs = supplierDocs.Select(supplierDoc =>
            {
                return _mapper.Map<SupplierDTO>(supplierDoc);
            }).ToList();

            return supplierDTOs;
        }

        public async Task<string> GetNewSupplierIdAsync()
        {
            if (_memoryCache.TryGetValue("LastestSupplierId", out string? lastestId))
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

            string currLastestId = (await CosmosDbUtils.GetDocumentByQueryDefinition<ResponseToGetId>(_supplierContainer, queryDef))!.Id;
            string newId = IdUtils.IncreaseId(currLastestId);

            _memoryCache.Set("LastestSupplierId", newId);
            return newId;
        }

        public async Task<SupplierDTO> GetSupplierDTOByIdAsync(string id)
        {
            var supplierDoc = await GetSupplierDocumentByIdAsync(id);

            var supplierDTO = _mapper.Map<SupplierDTO>(supplierDoc);

            return supplierDTO;
        }

        public async Task DeleteSupplierAsync(string id)
        {
            //var supplierDoc = await GetSupplierDocumentByIdAsync(id);

            //if (supplierDoc == null)
            //{
            //    throw new Exception("Supplier Not found!");
            //}

            //List<PatchOperation> patchOperations = new List<PatchOperation>()
            //{
            //    PatchOperation.Replace("/isDeleted", true)
            //};

            //await _supplierContainer.PatchItemAsync<SupplierDocument>(id, new PartitionKey(supplierDoc.SupplierId), patchOperations);
        }

        private async Task<SupplierDocument?> GetSupplierDocumentByIdAsync(string id)
        {
            var queryDef = new QueryDefinition(
                query:
                    "SELECT * " +
                    "FROM po " +
                    "WHERE po.id = @id"
            ).WithParameter("@id", id);

            var supplier = await CosmosDbUtils.GetDocumentByQueryDefinition<SupplierDocument>(_supplierContainer, queryDef);

            return supplier;
        }
    }
}
