using System;
using System.Text.Json;
using System.Threading.Tasks;
using AutoMapper;
using EasyImport.WebApi.Models;
using StackExchange.Redis;

namespace EasyImport.WebApi.Data
{
    public class BasketRepository : IBasketRepository
    {
        // private readonly IGenericRepository<Product> repo;
        // private readonly Mapper mapper;

        private readonly IDatabase database;
        // public BasketRepository(IConnectionMultiplexer redis, IGenericRepository<Product> repo, Mapper mapper)
        // {
        //     this.mapper = mapper;
        //     this.repo = repo;
        //     database = redis.GetDatabase();
        // }

        public BasketRepository(IConnectionMultiplexer redis)
        {
            database = redis.GetDatabase();
        }

        public async Task<bool> DeleteBasketAsync(string id)
        {
            return await database.KeyDeleteAsync(id);
        }

        public async Task<Basket> GetBasketAsync(string basketId)
        {
            var data = await database.StringGetAsync(basketId);

            //     var oldData = JsonSerializer.Deserialize<Basket>(data);

            //    var updateData = await UpdateData(oldData);           

            return data.IsNullOrEmpty ? null : JsonSerializer.Deserialize<Basket>(data);
        }

        // private async Task<Basket> UpdateData(Basket oldData)
        // {
        //     var updatedBasket = new Basket();
        //     foreach (var item in oldData.Items)
        //     {
        //         var productFromRepo = await repo.GetByIdAsync(item.Id);
        //         var basketItem = mapper.Map<BasketItem>(productFromRepo);
        //         basketItem.Quantity = item.Quantity;
        //         updatedBasket.Items.Add(basketItem);
        //     }
        //     return updatedBasket;
        // }

        public async Task<Basket> UpdateBasketAsync(Basket basket)
        {
            var created = await database.StringSetAsync(basket.Id, JsonSerializer.Serialize(basket), TimeSpan.FromDays(30));

            if (!created) return null;

            return await GetBasketAsync(basket.Id);
        }
    }
}