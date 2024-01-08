using CosmosChangeFeedFunction.Models.Documents;

namespace CosmosChangeFeedFunction.Repositories.Interfaces
{
    public interface ISupplierGroupRepository
    {
        Task DeleteSupplierGroupAsync(SupplierGroup supplierGroup);
        Task<SupplierGroup?> GetSupplierGroupByIdAsync(string supplierGroupId);
    }
}
