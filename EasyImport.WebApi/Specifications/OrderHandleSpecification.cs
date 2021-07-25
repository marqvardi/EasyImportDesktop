using EasyImport.WebApi.Dtos.Order;
using EasyImport.WebApi.Models;
using EasyImport.WebApi.Specification;

namespace EasyImport.WebApi.Specifications
{
    public class OrderHandleSpecification : BaseSpecification<OrderItem>
    {
        public OrderHandleSpecification(OrderHandleItem orderHandle) : base(x => x.OrderId == orderHandle.OrderId && x.ProductId == orderHandle.ProductId)
        {

        }
    }
}