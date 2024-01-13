using AutoMapper;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Models.Responses;
using BookstoreWebAPI.Utils;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Caching.Memory;
using BookstoreWebAPI.Exceptions;
using BookstoreWebAPI.Repository.Interfaces;
using System.Security.Authentication;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Services;
using Azure.Search.Documents.Models;

namespace BookstoreWebAPI.Repository
{
    public class StaffRepository : IStaffRepository
    {
        private readonly string _staffNewIdCacheName = "LastestStaffId";

        private readonly ILogger<StaffRepository> _logger;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _memoryCache;
        private readonly Container _staffContainer;
        private readonly EmailUtils _emailUtils;
        private readonly AzureSearchClientService _searchService;
        private readonly IndexDocumentsBatch<SearchDocument> _staffBatch;

        public int TotalCount { get; private set; }

        public StaffRepository(
            ILogger<StaffRepository> logger,
            IMapper mapper,
            IMemoryCache memoryCache,
            CosmosClient cosmosClient,
            EmailUtils emailUtils,
            AzureSearchServiceFactory searchServiceFactory
        )
        {
            var databaseName = cosmosClient.ClientOptions.ApplicationName;
            var containerName = "staffs";

            _staffContainer = cosmosClient.GetContainer(databaseName, containerName);
            _searchService = searchServiceFactory.Create(containerName);
            _mapper = mapper;
            _memoryCache = memoryCache;
            _logger = logger;
            _emailUtils = emailUtils;
            _staffBatch = new();
        }

        public async Task<IEnumerable<StaffDTO>> GetStaffDTOsAsync(QueryParameters queryParams, StaffFilterModel filter)
        {
            filter.Query ??= "*";
            var options = AzureSearchUtils.BuildOptions(queryParams, filter);
            var searchResult = await _searchService.SearchAsync<StaffDocument>(filter.Query, options);
            TotalCount = searchResult.TotalCount;
            var staffDocs = searchResult.Results;

            var staffDTOs = staffDocs.Select(staffDoc =>
            {
                return _mapper.Map<StaffDTO>(staffDoc);
            }).ToList();

            return staffDTOs;
        }

        public async Task<StaffDTO?> GetStaffDTOByIdAsync(string id)
        {
            var staffDoc = await GetStaffDocumentByIdAsync(id);

            var staffDTO = _mapper.Map<StaffDTO>(staffDoc);

            return staffDTO;
        }

        public async Task<AuthenticateResult> GetStaffUsingCredentials(LoginModel data)
        {
            var queryDef = new QueryDefinition(
                " SELECT * " +
                " FROM c " +
                " WHERE STRINGEQUALS(c.contact.email, @email, true)"
            ).WithParameter("@email", data.Email);

            var staffDoc = await CosmosDbUtils.GetDocumentByQueryDefinition<StaffDocument>(_staffContainer, queryDef)
                ?? throw new DocumentNotFoundException($"Staff with email {data.Email} not found.");

            if (staffDoc.IsActive == false)
            {
                throw new AccountDisabledException();
            }

            var isValidByDefaultPassword = staffDoc.DefaultPassword != null && data.Password == staffDoc.DefaultPassword;

            var isValidByMainPassword = false;

            if (staffDoc.HashedAndSaltedPassword != null)
            {
                isValidByMainPassword = staffDoc.HashedAndSaltedPassword != null && SecretHasher.Verify(data.Password, staffDoc.HashedAndSaltedPassword);
            }

            AuthenticateResult result = new()
            {
                User = _mapper.Map<StaffDTO>(staffDoc)
            };
            // case 1
            if (isValidByDefaultPassword || isValidByMainPassword)
            {
                result.NeedReset = isValidByDefaultPassword;
                return result;
            }

            throw new InvalidCredentialException();
        }

        public async Task<StaffDTO> AddStaffDTOAsync(StaffDTO staffDTO)
        {
            // validation for uniqueness
            if (await EmailExistsInContainer(staffDTO.Contact.Email))
            {
                throw new DuplicateDocumentException($"The email {staffDTO.Contact.Email} is already been used. Please choose a different email");
            }

            var staffDoc = _mapper.Map<StaffDocument>(staffDTO);
            await PopulateDataToNewStaffDocument(staffDoc);

            // logic to generate an password, then send to email, hash&salt it and then save in db
            await SendEmailWithDefaultPasswordToStaffEmail(staffDoc);


            var createdDocument = await AddStaffDocumentAsync(staffDoc);
            if (createdDocument.StatusCode == System.Net.HttpStatusCode.Created)
            {
                _memoryCache.Set(_staffNewIdCacheName, IdUtils.IncreaseId(staffDoc.Id));

                _searchService.InsertToBatch(_staffBatch, createdDocument.Resource, BatchAction.Upload);
                await _searchService.ExecuteBatchIndex(_staffBatch);

                _logger.LogInformation($"[StaffRepository] Uploaded new staff {createdDocument.Resource.Id} to index");


                return _mapper.Map<StaffDTO>(createdDocument.Resource);
            }


            throw new Exception($"Failed to create staff with id: {staffDoc.Id}");
        }

        public async Task UpdateStaffDTOAsync(StaffDTO staffDTO)
        {

            var staffInDb = await GetStaffDocumentByIdAsync(staffDTO.StaffId)
                ?? throw new DocumentNotFoundException("Staff Not Found");


            if (await EmailExistsInContainer(staffDTO.Contact.Email) && staffDTO.Contact.Email != staffInDb.Contact.Email)
            {
                throw new DuplicateDocumentException($"The email {staffDTO.Contact.Email} is already been used. Please choose a different email");
            }

            var staffToUpdate = _mapper.Map<StaffDocument>(staffDTO);
            staffToUpdate.ModifiedAt = DateTime.UtcNow;

            staffToUpdate.HashedAndSaltedPassword = staffInDb.HashedAndSaltedPassword;
            staffToUpdate.DefaultPassword = staffInDb.DefaultPassword;
            staffToUpdate.IsDeleted = staffInDb.IsDeleted;
            staffToUpdate.IsRemovable = staffInDb.IsRemovable;

            await _staffContainer.UpsertItemAsync(
                item: staffToUpdate,
                partitionKey: new PartitionKey(staffToUpdate.StaffId)
            );

            _searchService.InsertToBatch(_staffBatch, staffToUpdate, BatchAction.Merge);
            await _searchService.ExecuteBatchIndex(_staffBatch);

            _logger.LogInformation($"[StaffRepository] Merged uploaded staff {staffToUpdate.Id} to index");

        }

        public async Task UpdatePasswordAsync(UpdatePasswordModel data)
        {
            StaffDocument staffDoc = (await GetStaffDocumentByEmailAsync(data.Email!))!;

            var hashedAndSaltedPassword = SecretHasher.Hash(data.NewPassword);
            staffDoc.ModifiedAt = DateTime.UtcNow;
            staffDoc.HashedAndSaltedPassword = hashedAndSaltedPassword;
            staffDoc.DefaultPassword = null;

            await _staffContainer.UpsertItemAsync(
                item:staffDoc,
                partitionKey: new PartitionKey(staffDoc.StaffId)
            );
        }

        public async Task UpdateForgotPasswordAsync(string email)
        {
            var staffDoc = (await GetStaffDocumentByEmailAsync(email))!;

            await SendEmailWithDefaultPasswordToStaffEmail(staffDoc);

            await _staffContainer.UpsertItemAsync(
                item: staffDoc,
                partitionKey: new PartitionKey(staffDoc.StaffId));
        }

        public async Task<BatchDeletionResult<StaffDTO>> DeleteStaffDTOsAsync(string[] ids)
        {
            BatchDeletionResult<StaffDTO> result = new()
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
                var staffDoc = await GetStaffDocumentByIdAsync(id);
                var staffDTO = _mapper.Map<StaffDTO>(staffDoc);

                // Handle case where supplierDoc is null
                if (staffDoc == null)
                {
                    CosmosDbUtils.AddResponse(
                        batchDeletionResult: result,
                        responseOrder: currOrder,
                        responseData: staffDTO,
                        statusCode: 404
                    );
                    continue;
                }

                // Handle case where supplierDoc is not removable
                if (!staffDoc.IsRemovable)
                {
                    CosmosDbUtils.AddResponse(
                        batchDeletionResult: result,
                        responseOrder: currOrder,
                        responseData: staffDTO,
                        statusCode: 403
                    );
                    continue;
                }

                // Delete the supplier
                await DeleteStaff(staffDoc);
                CosmosDbUtils.AddResponse(
                    batchDeletionResult: result,
                    responseOrder: currOrder,
                    responseData: staffDTO,
                    statusCode: 204
                );
                _searchService.InsertToBatch(_staffBatch, staffDoc, BatchAction.Merge);

                _logger.LogInformation($"Deleted staff with id: {id}");
            }
            await _searchService.ExecuteBatchIndex(_staffBatch);

            _logger.LogInformation($"[StaffRepository] Merged deleted categories into index, count: {_staffBatch.Actions.Count}");

            return result;

            // code to update the product in background using function
        }

        private async Task DeleteStaff(StaffDocument staffDoc)
        {
            List<PatchOperation> patchOperations =
            [
                PatchOperation.Replace("/isDeleted", true)
            ];

            await _staffContainer.PatchItemAsync<StaffDocument>(staffDoc.Id, new PartitionKey(staffDoc.StaffId), patchOperations);
        }

        private async Task<bool> EmailExistsInContainer(string email)
        {
            var queryDef = new QueryDefinition(
                "SELECT * " +
                "FROM c " +
                "WHERE c.isDeleted = false AND STRINGEQUALS(@email, c.contact.email, true)"
            ).WithParameter("@email", email);

            var result = await CosmosDbUtils.GetDocumentByQueryDefinition<StaffDocument>(_staffContainer, queryDef);

            return result != null;
        }

        private async Task PopulateDataToNewStaffDocument(StaffDocument staffDoc)
        {
            staffDoc.Id = await GetNewStaffIdAsync();
            staffDoc.StaffId = staffDoc.Id;

            staffDoc.IsActive = true;
            staffDoc.IsDeleted = false;
            staffDoc.IsRemovable = true;
        }

        public async Task<string> GetNewStaffIdAsync()
        {
            if (_memoryCache.TryGetValue(_staffNewIdCacheName, out string? lastestId))
            {
                if (!string.IsNullOrEmpty(lastestId))
                    return lastestId;
            }

            // Query the database to get the latest product ID
            QueryDefinition queryDef = new(
                query:
                "SELECT TOP 1 c.id " +
                "FROM c " +
                "ORDER BY c.id DESC"
            );

            string currLastestId = (await CosmosDbUtils.GetDocumentByQueryDefinition<ResponseToGetId>(_staffContainer, queryDef))!.Id;
            string newId = IdUtils.IncreaseId(currLastestId);

            _memoryCache.Set(_staffNewIdCacheName, newId);
            return newId;
        }

        private async Task<StaffDocument?> GetStaffDocumentByIdAsync(string id)
        {
            var queryDef = new QueryDefinition(
                query:
                    "SELECT * " +
                    "FROM c " +
                    "WHERE c.isDeleted = false AND c.id = @id"
            ).WithParameter("@id", id);

            var staff = await CosmosDbUtils.GetDocumentByQueryDefinition<StaffDocument>(_staffContainer, queryDef);

            return staff;
        }

        public async Task<StaffDocument?> GetStaffDocumentByEmailAsync(string email)
        {
            var queryDef = new QueryDefinition(
                query:
                    "SELECT * " +
                    "FROM c " +
                    "WHERE c.isDeleted = false AND STRINGEQUALS(c.contact.email, @email, true)"
            ).WithParameter("@email", email);

            var staff = await CosmosDbUtils.GetDocumentByQueryDefinition<StaffDocument>(_staffContainer, queryDef);

            return staff;
        }

        private async Task SendEmailWithDefaultPasswordToStaffEmail(StaffDocument staffDoc)
        {
            var defaultPassword = PasswordUtils.GenerateDefaultPassword();

            try
            {
                await _emailUtils.SendDefaultPasswordToEmail(staffDoc.Contact.Email, defaultPassword);

                staffDoc.DefaultPassword = defaultPassword;
                staffDoc.HashedAndSaltedPassword = null;
            }
            catch (Exception)
            {
                throw new InvalidEmailException();
            }
        }

        private async Task<ItemResponse<StaffDocument>> AddStaffDocumentAsync(StaffDocument item)
        {
            item.CreatedAt = DateTime.UtcNow;
            item.ModifiedAt = item.CreatedAt;

            return await _staffContainer.UpsertItemAsync(
                item: item,
                partitionKey: new PartitionKey(item.StaffId)
            );
        }

        
    }
}
