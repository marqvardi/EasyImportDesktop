using EasyImport.WebApi.Models;

namespace EasyImport.WebApi.Dtos
{
    public class OrderCreateDto
    {
        public OrderDetails OrderDetails { get; set; }
        public Basket Basket { get; set; }
    }
}