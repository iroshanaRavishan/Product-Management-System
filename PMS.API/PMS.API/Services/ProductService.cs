using Microsoft.EntityFrameworkCore;
using PMS.API.Data;
using PMS.API.Interfaces;
using PMS.API.Models;

namespace PMS.API.Services
{
    public class ProductService : IProductService
    {
        private readonly PMSDbContext _context;

        public ProductService(PMSDbContext context)
        {
            _context = context;
        }

        public async Task<List<Product>> GetProductsAsync(int pageNumber, int pageSize, string sortBy = null, string sortDirection = "asc")
        {
            var productsQuery = _context.products.AsQueryable();

            // Apply sorting only if sortBy is provided
            if (!string.IsNullOrEmpty(sortBy))
            {
                switch (sortBy.ToLower())
                {
                    case "name":
                        productsQuery = sortDirection == "desc"
                            ? productsQuery.OrderByDescending(p => p.Name)
                            : productsQuery.OrderBy(p => p.Name);
                        break;
                    case "type":
                        productsQuery = sortDirection == "desc"
                            ? productsQuery.OrderByDescending(p => p.Type)
                            : productsQuery.OrderBy(p => p.Type);
                        break;
                    case "color":
                        productsQuery = sortDirection == "desc"
                            ? productsQuery.OrderByDescending(p => p.Color)
                            : productsQuery.OrderBy(p => p.Name);
                        break;
                    case "price":
                        productsQuery = sortDirection == "desc"
                            ? productsQuery.OrderByDescending(p => p.Price)
                            : productsQuery.OrderBy(p => p.Price);
                        break;
                }
            }

            var products = await productsQuery
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return products;
        }

        public async Task<int> GetTotalProductsCountAsync()
        {
            return await _context.products.CountAsync();
        }
    }
    
}
