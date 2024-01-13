using BookstoreWebAPI.Models.DTOs;

namespace BookstoreWebAPI.Repository.Interfaces
{
    public interface ILocationRepository
    {
        int TotalCount { get; }
        Task<IEnumerable<LocationDTO>> GetLocationDTOsAsync();
        Task UpdateLocationDTO(LocationDTO locationDTO);
    }
}
