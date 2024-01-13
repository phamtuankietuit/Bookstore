using AutoMapper;
using BookstoreWebAPI.Enums;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Repository.Interfaces;
using BookstoreWebAPI.Services;
using BookstoreWebAPI.Utils;
using Microsoft.Azure.Cosmos;

namespace BookstoreWebAPI.Repository
{
    public class LocationRepository : ILocationRepository
    {
        private readonly ILogger<LocationRepository> _logger;
        private readonly IMapper _mapper;
        private readonly Container _locationContainer;
        private readonly AzureSearchClientService _searchService;
        private readonly IActivityLogRepository _activityLogRepository;
        private UserContextService _userContextService;

        public int TotalCount { get; private set; }

        public LocationRepository(
            CosmosClient cosmosClient,
            ILogger<LocationRepository> logger,
            AzureSearchServiceFactory serviceFactory,
            IMapper mapper,
            IActivityLogRepository activityLogRepository
,
            UserContextService userContextService)
        {
            var databaseName = cosmosClient.ClientOptions.ApplicationName;
            var containerName = "locations";
            _locationContainer = cosmosClient.GetContainer(databaseName, containerName);

            _logger = logger;
            _mapper = mapper;
            _activityLogRepository = activityLogRepository;
            _userContextService = userContextService;
        }

        public async Task<IEnumerable<LocationDTO>> GetLocationDTOsAsync()
        {
            var queryParams = new QueryParameters()
            {
                PageNumber = 1,
                PageSize = -1,
            };

            var queryDef = CosmosDbUtils.BuildQuery(queryParams, isRemovableDocument:false);

            var locationDocs = await CosmosDbUtils.GetDocumentsByQueryDefinition<LocationDocument>(_locationContainer, queryDef);

            var locationDTOs = locationDocs.Select(doc =>
            {
                return _mapper.Map<LocationDTO>(doc);
            });

            TotalCount = locationDTOs.Count();

            return locationDTOs;
        }

        public async Task UpdateLocationDTO(LocationDTO locationDTO)
        {
            var locationDoc = _mapper.Map<LocationDocument>(locationDTO);
            locationDoc.ModifedAt = DateTime.UtcNow;

            await _locationContainer.UpsertItemAsync(locationDoc, new PartitionKey(locationDoc.LocationId));

            await _activityLogRepository.LogActivity(
                ActivityType.update,
                _userContextService.Current.StaffId,
                "Location",
                locationDoc.Id
            );
        }
    }
}
