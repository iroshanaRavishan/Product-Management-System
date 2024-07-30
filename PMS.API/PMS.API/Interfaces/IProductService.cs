using PMS.API.Models;

namespace PMS.API.Interfaces
{
    public interface IProductService
    {
        Task<List<Product>> GetProductsAsync(int pageNumber, int pageSize, string sortBy, string sortDirection, string name); 
        Task<(List<Product> Products, int TotalCount)> GetSearchedProductsAsync(int pageNumber, int pageSize, string sortBy, string sortDirection, string name);
        Task<int> GetTotalProductsCountAsync();
        IEnumerable<string> GetSuggestions(string query);
    }
}
