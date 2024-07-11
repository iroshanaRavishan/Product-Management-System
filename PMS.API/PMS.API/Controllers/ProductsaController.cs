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

        [HttpGet]
        [Route("{id:guid}")]
        public async Task<IActionResult> GetItem(Guid id)
        {
            var product = await _pmsDbcontext.products.FirstOrDefaultAsync(x => x.Id == id);
            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }

        [HttpPut]
        [Route("{id:guid}")]
        public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] Product productToUpdate)
        {
            if (productToUpdate == null)
            {
                return BadRequest("Product data is null");
            }

            var product = await _pmsDbcontext.products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            // Update the product's properties
            product.Name = productToUpdate.Name;
            product.Type = productToUpdate.Type;
            product.Color = productToUpdate.Color;
            product.Price = productToUpdate.Price;

            // Save changes to the database
            try
            {
                await _pmsDbcontext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return Ok(productToUpdate);
        }

        private bool ProductExists(Guid id)
        {
            return _pmsDbcontext.products.Any(e => e.Id == id);
        }


        [HttpDelete]
        [Route("{id:guid}")]
        public async Task<IActionResult> DeleteProduct(Guid id)
        {
            var product = await _pmsDbcontext.products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _pmsDbcontext.products.Remove(product);
            await _pmsDbcontext.SaveChangesAsync();

            return Ok(product);
        }
    }

}

