using PMS.API.Models;

namespace PMS.API.Interfaces
{
    public interface IProductService
    {
        Task<List<Product>> GetProductsAsync(int pageNumber, int pageSize, string sortBy, string sortDirection);
        Task<int> GetTotalProductsCountAsync();
    }
}
