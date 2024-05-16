using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PMS.API.Data;
using PMS.API.Models;

namespace PMS.API.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class ProductsController : Controller
    {
        private readonly PMSDbContext _pmsDbcontext;
        public ProductsController(PMSDbContext pmsDbContext)
        {
            this._pmsDbcontext = pmsDbContext;  
        }
        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            var products  = await _pmsDbcontext.products.ToListAsync();

            return Ok(products);
            
        }

        [HttpPost]
        public async Task<IActionResult> AddProduct([FromBody] Product product)
        { 
            product.Id = Guid.NewGuid();

            await _pmsDbcontext.AddAsync(product);
            await _pmsDbcontext.SaveChangesAsync();

            return Ok(product);
        }

    }
}
