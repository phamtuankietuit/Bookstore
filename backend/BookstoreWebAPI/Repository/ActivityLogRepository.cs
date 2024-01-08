using AutoMapper;
using BookstoreWebAPI.Enums;
using BookstoreWebAPI.Exceptions;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
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
    public class ActivityLogRepository : IActivityLogRepository
    {
        private readonly string _activityLogNewIdCacheName = "LastestActivityLogId";
        private readonly IConfiguration _configuration;
        private readonly ILogger<AccountRepository> _logger;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _memoryCache;
        private readonly Container _logContainer;
        private readonly IStaffRepository _staffRepository;
        private readonly AzureSearchService _searchService;


        private readonly Dictionary<string,string> dicitonary = new Dictionary<string, string>()
                {
                    { "log_in", "Đã đăng nhập" },
                    { "create", "Tạo" },
                    { "update", "Cập nhật" },
                    { "delete", "Xóa" }
                };
        public Dictionary<string, string> ActivityTypeWithNamePairs { get => dicitonary; }

        public int TotalCount { get; private set; }

        public ActivityLogRepository(
            CosmosClient cosmosClient,
            IConfiguration configuration,
            ILogger<AccountRepository> logger,
            IMemoryCache memoryCache,
            IMapper mapper,
            IStaffRepository staffRepository,
            AzureSearchServiceFactory searchServiceFactory)
        {
            var databaseName = cosmosClient.ClientOptions.ApplicationName;
            var containerName = "activityLogs";
            _configuration = configuration;
            _logger = logger;
            _memoryCache = memoryCache;
            _mapper = mapper;
            _staffRepository = staffRepository;

            _logContainer = cosmosClient.GetContainer(databaseName, containerName);
            _searchService = searchServiceFactory.Create(containerName);
        }

        public async Task<int> GetTotalCount(QueryParameters queryParams, ActivityLogFilterModel filter)
        {
            var tempQueryParams = new QueryParameters()
            {
                PageNumber = 1,
                PageSize = -1
            };

            tempQueryParams.PageSize = -1;

            var queryDef = CosmosDbUtils.BuildQuery<ActivityLogDocument>(tempQueryParams, filter);

            var activityLogDocs = await CosmosDbUtils.GetDocumentsByQueryDefinition<ActivityLogDocument>(_logContainer, queryDef);

            var count = activityLogDocs.Count();

            return count;
        }

        public async Task<IEnumerable<ActivityLogDTO>> GetActivityLogDTOsAsync(
            QueryParameters queryParams,
            ActivityLogFilterModel filter)
        {
            filter.Query ??= "*";
            var options = AzureSearchUtils.BuildOptions(queryParams, filter);
            var searchResult = await _searchService.SearchAsync<ActivityLogDocument>(filter.Query, options);
            TotalCount = searchResult.TotalCount;
            var activityLogDocs = searchResult.Results;
            var activityLogDTOs = activityLogDocs.Select(activityLogDoc =>
            {
                return _mapper.Map<ActivityLogDTO>(activityLogDoc);
            }).ToList();

            return activityLogDTOs;
        }

        public async Task<ActivityLogDTO?> GetActivityLogDTOByIdAsync(string id)
        {
            var activityLogDoc = await GetActivityLogDocumentByIdAsync(id);

            var activityLogDTO = _mapper.Map<ActivityLogDTO>(activityLogDoc);

            return activityLogDTO;
        }

        public async Task<ActivityLogDTO> AddActivityLogDTOAsync(ActivityLogDTO activityLogDTO)
        {
            var activityLogDoc = _mapper.Map<ActivityLogDocument>(activityLogDTO);
            
            if (activityLogDoc.CreatedAt == null)
            {
                throw new LogTimestampNotFoundException();
            }

            if (activityLogDoc.StaffId == null)
                activityLogDoc.StaffId = "staf00000";

            var staff = await _staffRepository.GetStaffDTOByIdAsync(activityLogDoc.StaffId);
            
            var staffName = staff!.Name;

            activityLogDoc.Id = await GetNewActivityLogIdAsync();
            activityLogDoc.ActivityId = activityLogDoc.Id;
            activityLogDoc.StaffName ??= staffName;
            activityLogDoc.TTL = 604800;

            var createdDocument = await AddActivityLogDocumentAsync(activityLogDoc);
            if (createdDocument.StatusCode == System.Net.HttpStatusCode.Created)
            {
                _memoryCache.Set(_activityLogNewIdCacheName, IdUtils.IncreaseId(activityLogDoc.Id));
                return _mapper.Map<ActivityLogDTO>(createdDocument.Resource);
            }

            throw new ArgumentNullException(nameof(createdDocument));
        }

        public async Task<string> GetNewActivityLogIdAsync()
        {
            if (_memoryCache.TryGetValue(_activityLogNewIdCacheName, out string? lastestId))
            {
                if (!string.IsNullOrEmpty(lastestId))
                    return lastestId;
            }

            // Query the database to get the latest product ID
            QueryDefinition queryDef = new QueryDefinition(
                query:
                "SELECT TOP 1 c.id " +
                "FROM c " +
                "ORDER BY c.id DESC"
            );

            var response = await CosmosDbUtils.GetDocumentByQueryDefinition<ResponseToGetId>(_logContainer, queryDef);

            string currLastestId;
            if (response != null)
                currLastestId = response.Id;
            else
                currLastestId = "actl00000";

            string newId = IdUtils.IncreaseId(currLastestId);

            _memoryCache.Set(_activityLogNewIdCacheName, newId);
            return newId;
        }

        public async Task LogActivity(ActivityType activityType, string? staffId, string objectName="", string objectId="")
        {
            var activityTypeString = activityType.ToString();
            var activityName = GetActivityName(activityTypeString, objectName, objectId);
            var UtcNow = DateTime.UtcNow;
            await AddActivityLogDTOAsync(new ActivityLogDTO()
            {
                StaffId = staffId,
                ActivityType = activityTypeString,
                ActivityName = activityName,
                CreatedAt = UtcNow,
                ModifiedAt = UtcNow
            });
        }

        public string GetActivityName(string activityType, string objectName = "", string objectId = "")
        {
            return ActivityTypeWithNamePairs[activityType] + " " + objectName + " " + objectId;
        }


        private async Task<ActivityLogDocument?> GetActivityLogDocumentByIdAsync(string id)
        {
            var queryDef = new QueryDefinition(
                query:
                    "SELECT * " +
                    "FROM c " +
                    "WHERE c.isDeleted = false AND c.id = @id"
            ).WithParameter("@id", id);

            var activityLog = await CosmosDbUtils.GetDocumentByQueryDefinition<ActivityLogDocument>(_logContainer, queryDef);

            return activityLog;
        }

        public async Task<ItemResponse<ActivityLogDocument>> AddActivityLogDocumentAsync(ActivityLogDocument item)
        {

            return await _logContainer.UpsertItemAsync(item, new PartitionKey(item.StaffId));
        }

        
    }
}
