using AutoMapper;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Caching.Memory;
using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Repository.Interfaces;
using BookstoreWebAPI.Utils;

namespace BookstoreWebAPI.Repository
{
    public class PromotionRepository : IPromotionRepository
    {
        private Container _promotionContainer;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _memoryCache;

        public PromotionRepository(CosmosClient cosmosClient, IMapper mapper, IMemoryCache memoryCache)
        {
            var databaseName = cosmosClient.ClientOptions.ApplicationName;
            var containerName = "promotions";

            _promotionContainer = cosmosClient.GetContainer(databaseName, containerName);
            this._mapper = mapper;
            this._memoryCache = memoryCache;
        }

        public async Task AddPromotionDocumentAsync(PromotionDocument item)
        {
            await _promotionContainer.UpsertItemAsync(
                item: item,
                partitionKey: new PartitionKey(item.PromotionId)
            );
        }

        public async Task AddPromotionDTOAsync(PromotionDTO promotionDTO)
        {
            var promotionDoc = _mapper.Map<PromotionDocument>(promotionDTO);

            await AddPromotionDocumentAsync(promotionDoc);
        }
        public async Task UpdatePromotionAsync(PromotionDTO promotionDTO)
        {
            var promotionToUpdate = _mapper.Map<PromotionDocument>(promotionDTO);

            await _promotionContainer.UpsertItemAsync(
                item: promotionToUpdate,
                partitionKey: new PartitionKey(promotionToUpdate.PromotionId)
            );
        }

        public async Task<IEnumerable<PromotionDTO>> GetPromotionDTOsAsync()
        {
            var queryDef = new QueryDefinition(
                query:
                    "SELECT * " +
                    "FROM po"
            );

            var promotionDocs = await CosmosDbUtils.GetDocumentsByQueryDefinition<PromotionDocument>(_promotionContainer, queryDef);
            var promotionDTOs = promotionDocs.Select(promotionDoc =>
            {
                return _mapper.Map<PromotionDTO>(promotionDoc);
            }).ToList();

            return promotionDTOs;
        }

        public async Task<string> GetNewPromotionIdAsync()
        {
            if (_memoryCache.TryGetValue("LastestPromotionId", out string? lastestId))
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

            string currLastestId = (await CosmosDbUtils.GetDocumentByQueryDefinition<ResponseToGetId>(_promotionContainer, queryDef))!.Id;
            string newId = IdUtils.IncreaseId(currLastestId);

            _memoryCache.Set("LastestPromotionId", newId);
            return newId;
        }

        public async Task<PromotionDTO> GetPromotionDTOByIdAsync(string id)
        {
            var promotionDoc = await GetPromotionDocumentByIdAsync(id);

            var promotionDTO = _mapper.Map<PromotionDTO>(promotionDoc);

            return promotionDTO;
        }

        public async Task DeletePromotionAsync(string id)
        {
            //var promotionDoc = await GetPromotionDocumentByIdAsync(id);

            //if (promotionDoc == null)
            //{
            //    throw new Exception("Promotion Not found!");
            //}

            //List<PatchOperation> patchOperations = new List<PatchOperation>()
            //{
            //    PatchOperation.Replace("/isDeleted", true)
            //};

            //await _promotionContainer.PatchItemAsync<PromotionDocument>(id, new PartitionKey(promotionDoc.Id), patchOperations);
        }

        private async Task<PromotionDocument?> GetPromotionDocumentByIdAsync(string id)
        {
            var queryDef = new QueryDefinition(
                query:
                    "SELECT * " +
                    "FROM po " +
                    "WHERE po.id = @id"
            ).WithParameter("@id", id);

            var promotion = await CosmosDbUtils.GetDocumentByQueryDefinition<PromotionDocument>(_promotionContainer, queryDef);

            return promotion;

        }
    }
}
