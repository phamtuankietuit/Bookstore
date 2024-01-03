using Azure;
using Azure.Storage.Blobs.Models;
using BookstoreWebAPI.Models.BindingModels;

namespace BookstoreWebAPI.Services
{
    public interface IFileService
    {
        Task<FileModel> UploadAsync(IFormFile fileModel);
        Task DeleteAsync(string blobName);
        //Task<string> UploadBase64(string base64Data);
    }
}
