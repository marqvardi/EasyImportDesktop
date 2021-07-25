using System.Threading.Tasks;
using EasyImport.WebApi.Data;
using EasyImport.WebApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EasyImport.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Policy = "RequireAdminRole")]
    [Authorize(Roles = "Admin, SimpleUser")]

    public class BasketController : ControllerBase
    {
        private readonly IBasketRepository repository;
        public BasketController(IBasketRepository repository)
        {
            this.repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<Basket>> GetBasketByI(string id)
        {
            var basket = await repository.GetBasketAsync(id);
            return Ok(basket ?? new Basket(id));
        }

        [HttpPost]
        public async Task<ActionResult<Basket>> UpdateBasket(Basket basket)
        {
            var updatedBasket = await repository.UpdateBasketAsync(basket);
            return Ok(updatedBasket);
        }

        [HttpDelete]
        public async Task DeleteBasketAsync(string id)
        {
            await repository.DeleteBasketAsync(id);
        }
    }
}