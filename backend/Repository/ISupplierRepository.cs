using SE100_BookstoreWebAPI.Models.Documents;

namespace SE100_BookstoreWebAPI.Repository
{
    public interface ISupplierRepository
    {
        Task AddSupplierAsync(SupplierDocument item);
    }
}
