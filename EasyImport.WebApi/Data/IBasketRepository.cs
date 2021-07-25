using System.Threading.Tasks;
using EasyImport.WebApi.Models;

namespace EasyImport.WebApi.Data
{
    public interface IBasketRepository
    {
        Task<Basket> GetBasketAsync(string id);
        Task<Basket> UpdateBasketAsync(Basket basket);
        Task<bool> DeleteBasketAsync(string id);
    }
}