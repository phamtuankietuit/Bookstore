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
using Microsoft.Azure.Cosmos.Linq;
using System.Security.Authentication;

namespace BookstoreWebAPI.Repository
{
    public class StaffRepository : IStaffRepository
    {
        private readonly string _staffNewIdCacheName = "LastestStaffId";
        private readonly EmailUtils _emailUtils;
        private readonly ILogger<StaffRepository> _logger;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _memoryCache;
        private Container _staffContainer;

        public StaffRepository(
            CosmosClient cosmosClient,
            IMapper mapper,
            IMemoryCache memoryCache,
            ILogger<StaffRepository> logger,
            EmailUtils emailUtils)
        {
            var databaseName = cosmosClient.ClientOptions.ApplicationName;
            var containerName = "staffs";

            _staffContainer = cosmosClient.GetContainer(databaseName, containerName);
            _mapper = mapper;
            _memoryCache = memoryCache;
            _logger = logger;
            _emailUtils = emailUtils;
        }

        public async Task<int> GetTotalCount(QueryParameters queryParams)
        {
            var tempQueryParams = new QueryParameters()
            {
                PageNumber = 1,
                PageSize = -1
            };

            tempQueryParams.PageSize = -1;

            var queryDef = CosmosDbUtils.BuildQuery<StaffDocument>(tempQueryParams);

            var staffDocs = await CosmosDbUtils.GetDocumentsByQueryDefinition<StaffDocument>(_staffContainer, queryDef);

            var count = staffDocs.Count();

            return count;
        }

        public async Task<IEnumerable<StaffDTO>> GetStaffDTOsAsync(QueryParameters queryParams)
        {
            var queryDef = CosmosDbUtils.BuildQuery<StaffDocument>(queryParams);

            var staffDocs = await CosmosDbUtils.GetDocumentsByQueryDefinition<StaffDocument>(_staffContainer, queryDef);
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

        public async Task<StaffDTO> GetStaffUsingCredentials(LoginModel data)
        {
            var queryDef = new QueryDefinition(
                " SELECT * " +
                " FROM c " +
                " WHERE STRINGEQUALS(c.contact.email, @email, true)"
            ).WithParameter("@email", data.Email);

            var staffDoc= await CosmosDbUtils.GetDocumentByQueryDefinition<StaffDocument>(_staffContainer, queryDef) 
                ?? throw new DocumentNotFoundException($"Staff with email {data.Email} not found.");

            // case 1
            if (staffDoc.DefaultPassword != null && data.Password == staffDoc.DefaultPassword)
            {
                var result = _mapper.Map<StaffDTO>(staffDoc);
                return result;
            }

            // case 2
            if (staffDoc.HashedAndSaltedPassword != null && SecretHasher.Verify(data.Password, staffDoc.HashedAndSaltedPassword))
            {
                var result = _mapper.Map<StaffDTO>(staffDoc);
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

                return _mapper.Map<StaffDTO>(createdDocument.Resource);
            }

            throw new ArgumentNullException(nameof(createdDocument));
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

        public async Task UpdateStaffDTOAsync(StaffDTO staffDTO)
        {
            var staffToUpdate = _mapper.Map<StaffDocument>(staffDTO);
            staffToUpdate.ModifiedAt = DateTime.UtcNow;

            await _staffContainer.UpsertItemAsync(
                item: staffToUpdate,
                partitionKey: new PartitionKey(staffToUpdate.StaffId)
            );
        }

        public async Task UpdatePasswordAsync(UpdatePasswordModel data)
        {
            StaffDocument staffDoc = (await GetStaffDocumentByEmailAsync(data.Email))!;

            var hashedAndSaltedPassword = SecretHasher.Hash(data.NewPassword);
            staffDoc.ModifiedAt = DateTime.UtcNow;
            staffDoc.HashedAndSaltedPassword = hashedAndSaltedPassword;
            staffDoc.DefaultPassword = null;

            await _staffContainer.UpsertItemAsync(
                item:staffDoc,
                partitionKey: new PartitionKey(staffDoc.StaffId)
            );
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

                _logger.LogInformation($"Deleted staff with id: {id}");
            }

            return result;

            // code to update the product in background using function
        }

        private async Task DeleteStaff(StaffDocument staffDoc)
        {
            List<PatchOperation> patchOperations = new()
            {
                PatchOperation.Replace("/isDeleted", true)
            };

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
            QueryDefinition queryDef = new QueryDefinition(
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

        private async Task<StaffDocument?> GetStaffDocumentByEmailAsync(string email)
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
