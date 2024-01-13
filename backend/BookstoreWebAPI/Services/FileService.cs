using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Utils;

namespace BookstoreWebAPI.Services
{
    public class FileService : IFileService
    {
        private readonly BlobServiceClient _blobServiceClient;
        private readonly string _cdnEndpoint;
        private readonly BlobContainerClient _blobContainerClient;

        public FileService(
            BlobServiceClient blobServiceClient,
            IConfiguration configuration)
        {
            _blobServiceClient = blobServiceClient;
            _cdnEndpoint = configuration["AzureCdn:Endpoint"]!;
            _blobContainerClient = _blobServiceClient.GetBlobContainerClient(configuration["AzureBlobStorage:ContainerName"]);
        }

        public async Task<FileModel> UploadAsync(IFormFile file)
        {
            if (VariableHelpers.IsNull(file))
                throw new ArgumentException("Image Files is needed");

            var blobName = CreateBlobName();

            var blobClient = _blobContainerClient.GetBlobClient(blobName);

            await blobClient.UploadAsync(file.OpenReadStream());

            return new FileModel()
            {
                ImageFiles = file,
                Url = $"{_cdnEndpoint}/{_blobContainerClient.Name}/{blobName}"
            };
        }
        

        public async Task DeleteAsync(string blobName)
        {
            var blobClient = _blobContainerClient.GetBlobClient(blobName);

            await blobClient.DeleteIfExistsAsync();
        }

        
        private string CreateBlobName()
        {
            DateTime date = DateTime.UtcNow;
            string dateString = date.ToString("yyyyMMddHHmmss");

            Guid uuid = Guid.NewGuid();

            return $"{dateString}-{uuid}";
        }
    }
}
