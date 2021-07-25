using EasyImport.WebApi.Dtos.Order;
using EasyImport.WebApi.Models;
using EasyImport.WebApi.Specification;

namespace EasyImport.WebApi.Specifications
{
    public class OrderHandleItemSpecification : BaseSpecification<OrderItem>
    {
        public OrderHandleItemSpecification(OrderHandleItem orderDeleteItem)
                    : base(x => x.OrderId == orderDeleteItem.OrderId && x.ProductId == orderDeleteItem.ProductId)
        {

        }
    }
}