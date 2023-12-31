﻿using AutoMapper;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Models.Responses;
using BookstoreWebAPI.Repository.Interfaces;
using BookstoreWebAPI.Utils;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Caching.Memory;

namespace BookstoreWebAPI.Repository
{
    public class AdjustmentTicketRepository : IAdjustmentTicketRepository
    {
        private readonly string adjustmentTicketNewIdCacheName = "LastestAdjustmentTicketId";
        private readonly ILogger<AdjustmentTicketRepository> _logger;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _memoryCache;
        private readonly IActivityLogRepository _activityLogRepository;
        private Container _adjustmentTicketContainer;


        public AdjustmentTicketRepository(
            CosmosClient cosmosClient,
            ILogger<AdjustmentTicketRepository> logger,
            IMapper mapper,
            IMemoryCache memoryCache,
            IActivityLogRepository activityLogRepository)
        {
            _logger = logger;
            _mapper = mapper;
            _memoryCache = memoryCache;

            var databaseName = cosmosClient.ClientOptions.ApplicationName;
            var containerName = "adjustmentTickets";

            _adjustmentTicketContainer = cosmosClient.GetContainer(databaseName, containerName);
            _activityLogRepository = activityLogRepository;
        }

        public async Task<int> GetTotalCount(QueryParameters queryParams, AdjustmentTicketFilterModel filter)
        {
            var tempQueryParams = new QueryParameters()
            {
                PageNumber = 1,
                PageSize = -1
            };

            var queryDef = CosmosDbUtils.BuildQuery<AdjustmentTicketDocument>(tempQueryParams, filter, isRemovableDocument: false);
            var adjustmentTickets = await CosmosDbUtils.GetDocumentsByQueryDefinition<AdjustmentTicketDTO>(_adjustmentTicketContainer, queryDef);

            var count = adjustmentTickets.Count();

            return count;
        }

        public async Task<IEnumerable<AdjustmentTicketDTO>> GetAdjustmentTicketDTOsAsync(QueryParameters queryParams, AdjustmentTicketFilterModel filter)
        {
            var queryDef = CosmosDbUtils.BuildQuery<AdjustmentTicketDocument>(queryParams, filter, isRemovableDocument: false);

            var adjustmentTicketDocs = await CosmosDbUtils.GetDocumentsByQueryDefinition<AdjustmentTicketDocument>(_adjustmentTicketContainer, queryDef);
            var adjustmentTicketDTOs = adjustmentTicketDocs.Select(adjustmentTicketDoc =>
            {
                return _mapper.Map<AdjustmentTicketDTO>(adjustmentTicketDoc);
            }).ToList();

            return adjustmentTicketDTOs;
        }

        public async Task<AdjustmentTicketDTO> GetAdjustmentTicketDTOByIdAsync(string id)
        {
            var adjustmentTicketDoc = await GetAdjustmentTicketDocumentByIdAsync(id);

            var adjustmentTicketDTO = _mapper.Map<AdjustmentTicketDTO>(adjustmentTicketDoc);

            return adjustmentTicketDTO;
        }

        public async Task<AdjustmentTicketDTO> AddAdjustmentTicketDTOAsync(AdjustmentTicketDTO adjustmentTicketDTO)
        {
            // validate unique purchase order


            var adjustmentTicketDoc = _mapper.Map<AdjustmentTicketDocument>(adjustmentTicketDTO);
            await PopulateDataToNewAdjustmentTicket(adjustmentTicketDoc);

            var createdDocument = await AddAdjustmentTicketDocumentAsync(adjustmentTicketDoc);

            if (createdDocument.StatusCode == System.Net.HttpStatusCode.Created)
            {
                _memoryCache.Set(adjustmentTicketNewIdCacheName, IdUtils.IncreaseId(adjustmentTicketDoc.Id));

                await _activityLogRepository.LogActivity(
                    Enums.ActivityType.create,
                    adjustmentTicketDoc.StaffId,
                    "Đơn nhập hàng",
                    adjustmentTicketDoc.AdjustmentTicketId
                );

                return _mapper.Map<AdjustmentTicketDTO>(createdDocument.Resource);
            }

            throw new ArgumentNullException(nameof(createdDocument));
        }





        public async Task UpdateAdjustmentTicketAsync(AdjustmentTicketDTO adjustmentTicketDTO)
        {
            var adjustmentTicketToUpdate = _mapper.Map<AdjustmentTicketDocument>(adjustmentTicketDTO);

            adjustmentTicketToUpdate.ModifiedAt = DateTime.UtcNow;

            await _adjustmentTicketContainer.UpsertItemAsync(
                item: adjustmentTicketToUpdate,
                partitionKey: new PartitionKey(adjustmentTicketToUpdate.AdjustmentTicketId)
            );

            await _activityLogRepository.LogActivity(
                Enums.ActivityType.update,
                adjustmentTicketToUpdate.StaffId,
                "Đơn nhập hàng",
                adjustmentTicketToUpdate.AdjustmentTicketId
            );

        }

        private async Task<string> GetNewAdjustmentTicketIdAsync()
        {
            if (_memoryCache.TryGetValue(adjustmentTicketNewIdCacheName, out string? lastestId))
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

            string currLastestId = (await CosmosDbUtils.GetDocumentByQueryDefinition<ResponseToGetId>(_adjustmentTicketContainer, queryDef))!.Id;
            string newId = IdUtils.IncreaseId(currLastestId);

            _memoryCache.Set("LastestAdjustmentTicketId", newId);
            return newId;
        }

        private async Task PopulateDataToNewAdjustmentTicket(AdjustmentTicketDocument adjustmentTicketDoc)
        {
            adjustmentTicketDoc.Id = await GetNewAdjustmentTicketIdAsync();
            adjustmentTicketDoc.AdjustmentTicketId = adjustmentTicketDoc.Id;


            adjustmentTicketDoc.Status ??= "Completed";
            adjustmentTicketDoc.Note ??= "";
            adjustmentTicketDoc.Tags ??= new();
            //adjustmentTicketDoc.IsRemovable = true;
            //adjustmentTicketDoc.IsDeleted = false;
        }

        private async Task<AdjustmentTicketDocument?> GetAdjustmentTicketDocumentByIdAsync(string id)
        {
            var queryDef = new QueryDefinition(
                query:
                    "SELECT * " +
                    "FROM po " +
                    "WHERE po.id = @id"
            ).WithParameter("@id", id);

            var adjustmentTicket = await CosmosDbUtils.GetDocumentByQueryDefinition<AdjustmentTicketDocument>(_adjustmentTicketContainer, queryDef);

            return adjustmentTicket;
        }

        private async Task<ItemResponse<AdjustmentTicketDocument>> AddAdjustmentTicketDocumentAsync(AdjustmentTicketDocument item)
        {
            try
            {
                item.CreatedAt = DateTime.UtcNow;
                item.AdjustmentTicketId = item.CreatedAt.Value.ToString("yyyy-MM");
                item.ModifiedAt = item.CreatedAt;

                var response = await _adjustmentTicketContainer.UpsertItemAsync(
                    item: item,
                    partitionKey: new PartitionKey(item.AdjustmentTicketId)
                );

                return response;
            }
            catch (CosmosException)
            {
                // unhandled
                throw new Exception("An exception thrown when creating the purchase order document");
            }
        }
    }
}
