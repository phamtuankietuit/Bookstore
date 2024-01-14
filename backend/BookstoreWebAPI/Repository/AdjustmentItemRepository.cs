using AutoMapper;
using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Models.Responses;
using BookstoreWebAPI.Repository.Interfaces;
using BookstoreWebAPI.Services;
using BookstoreWebAPI.Utils;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Caching.Memory;

namespace BookstoreWebAPI.Repository
{
    public class AdjustmentItemRepository : IAdjustmentItemRepository
    {
        private readonly string adjustmentItemNewIdCacheName = "LastestAdjustmentItemId";

        private readonly Container _adjustmentItemContainer;
        private readonly ILogger<AdjustmentItemRepository> _logger;

        private readonly IActivityLogRepository _activityLogRepository;
        private readonly UserContextService _userContextService;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _memoryCache;

        public AdjustmentItemRepository(
            CosmosClient cosmosClient,
            IActivityLogRepository activityLogRepository,
            IMapper mapper,
            IMemoryCache memoryCache,
            ILogger<AdjustmentItemRepository> logger,
            UserContextService userContextService
        )
        {
            var databaseName = cosmosClient.ClientOptions.ApplicationName;
            _adjustmentItemContainer = cosmosClient.GetContainer(databaseName, "adjustmentItems");
            _activityLogRepository = activityLogRepository;
            _mapper = mapper;
            _memoryCache = memoryCache;
            _logger = logger;
            _userContextService = userContextService;
        }

        public async Task<IEnumerable<AdjustmentItemDTO>?> GetAdjustmentItemsByTicketIdAsync(string ticketId)
        {
            var queryDef = new QueryDefinition(
                query:
                "SELECT * " +
                "FROM c " +
                $"WHERE STRINGEQUALS(c.adjustmentTicketId, '{ticketId}') " +
                $"  AND c.isDeleted = false"
            );

            var adItemDocs = await CosmosDbUtils.GetDocumentsByQueryDefinition<AdjustmentItemDocument>(_adjustmentItemContainer, queryDef);

            var adItemDTOs = adItemDocs.Select(_mapper.Map<AdjustmentItemDTO>);

            return adItemDTOs;
        }

        public async Task<AdjustmentItemDTO?> AddAdjustmentItemDTOAsync(AdjustmentItemDTO adjustmentItemDTO)
        {
            var adjustmentItemDoc = _mapper.Map<AdjustmentItemDocument>(adjustmentItemDTO);
            await PopulateDataToNewAdjustmentItemDocument(adjustmentItemDoc);

            var createdDocument = await AddAdjustmentItemDocumentAsync(adjustmentItemDoc);
            if (createdDocument.StatusCode == System.Net.HttpStatusCode.Created)
            {
                _memoryCache.Set(adjustmentItemNewIdCacheName, IdUtils.IncreaseId(adjustmentItemDoc.Id));

                _logger.LogInformation($"[AdjustmentItemRepository] Uploaded new adjustmentItem {createdDocument.Resource.Id} to index");


                return _mapper.Map<AdjustmentItemDTO>(createdDocument.Resource);
            }

            throw new ArgumentNullException(nameof(createdDocument));
        }

        public async Task UpdateListAdjustmentItemDTOsAsync(List<AdjustmentItemDTO> adjustmentItemDTOs)
        {
            string ticketId = adjustmentItemDTOs[0].AdjustmentTicketId;


            var adjustmentItemDTOsInDb = await GetAdjustmentItemsByTicketIdAsync(ticketId) 
                ?? throw new ArgumentException($"Can't find adjustmentItems in database based on ticket Id {ticketId}");
            var adjustmentItemIdsInDb = adjustmentItemDTOsInDb.Select(doc => doc.AdjustmentItemId);
            var adjustmentItemIdsFromDTO = adjustmentItemDTOs.Select(dto => dto.AdjustmentItemId);

            foreach (var adjustmentItemDTO in adjustmentItemDTOs)
            {
                var adjustmentItemDoc = await GetAdjustmentItemByIdAsync(adjustmentItemDTO.AdjustmentItemId)
                    ?? throw new ArgumentException($"Not found {adjustmentItemDTO.AdjustmentItemId}");

                if (adjustmentItemIdsInDb.Contains(adjustmentItemDTO.AdjustmentItemId))
                { 
                        await UpdateAdjustmentItemDTOAsync(adjustmentItemDoc);
                }
                else
                {
                    await DeleteAdjustmentItemAsync(adjustmentItemDoc);
                }
            }

            foreach (var item in adjustmentItemDTOsInDb)
            {
                if (!adjustmentItemIdsFromDTO.Contains(item.AdjustmentItemId))
                {
                    await AddAdjustmentItemDTOAsync(item);
                }
            }
        }

        public async Task UpdateAdjustmentItemDTOAsync(AdjustmentItemDocument adjustmentItemDocument)
        {
            adjustmentItemDocument.ModifiedAt = DateTime.UtcNow;

            await _adjustmentItemContainer.UpsertItemAsync(adjustmentItemDocument, new PartitionKey(adjustmentItemDocument.AdjustmentTicketId));
        }

        private async Task DeleteAdjustmentItemAsync(AdjustmentItemDocument adjustmentItemDoc)
        {
            adjustmentItemDoc.IsDeleted = true;
            List<PatchOperation> patchOperations =
            [
                PatchOperation.Replace("/isDeleted", true)
            ];

            await _adjustmentItemContainer.PatchItemAsync<AdjustmentItemDocument>(adjustmentItemDoc.Id, new PartitionKey(adjustmentItemDoc.AdjustmentItemId), patchOperations);

            // change feed to update the ticket
        }

        private async Task<AdjustmentItemDocument?> GetAdjustmentItemByIdAsync(string id)
        {
            var queryDef = new QueryDefinition(
                query:
                " SELECT * " +
                " FROM c " +
                $" WHERE STRINGEQUALS(c.id, '{id}')" +
                $"  AND c.isDeleted = false"
            );

            var reuslt = await CosmosDbUtils.GetDocumentByQueryDefinition<AdjustmentItemDocument>(_adjustmentItemContainer, queryDef);

            return reuslt;
        }

        private async Task PopulateDataToNewAdjustmentItemDocument(AdjustmentItemDocument adjustmentItemDoc)
        {
            adjustmentItemDoc.Id = await GetNewAdjustmentItemIdAsync();
            adjustmentItemDoc.AdjustmentItemId = adjustmentItemDoc.Id;
            
            adjustmentItemDoc.Note ??= "";
            adjustmentItemDoc.Tags ??= [];
        }

        private async Task<ItemResponse<AdjustmentItemDocument>> AddAdjustmentItemDocumentAsync(AdjustmentItemDocument item)
        {
            item.CreatedAt = DateTime.UtcNow;
            item.ModifiedAt = item.CreatedAt;


            return await _adjustmentItemContainer.UpsertItemAsync(
                item: item,
                partitionKey: new PartitionKey(item.AdjustmentItemId)
            );
        }




        public async Task<string> GetNewAdjustmentItemIdAsync()
        {
            if (_memoryCache.TryGetValue(adjustmentItemNewIdCacheName, out string? lastestId))
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

            string currLastestId = (await CosmosDbUtils.GetDocumentByQueryDefinition<ResponseToGetId>(_adjustmentItemContainer, queryDef))!.Id;
            string newId = IdUtils.IncreaseId(currLastestId);

            _memoryCache.Set(adjustmentItemNewIdCacheName, newId);
            return newId;
        }
    }
}
