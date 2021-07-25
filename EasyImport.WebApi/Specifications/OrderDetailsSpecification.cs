using EasyImport.WebApi.Models;
using EasyImport.WebApi.Specification;

namespace EasyImport.WebApi.Specifications
{
    public class OrderDetailsSpecification : BaseSpecification<OrderDetails>
    {
        public OrderDetailsSpecification(OrderSpecParams orderParams)
        {
            AddInclude(x => x.OrderItem);
            // AddGroupBy(x => x.OrderItem.OrderId);

            ApplyPaging(orderParams.PageSize * (orderParams.PageIndex - 1), orderParams.PageSize);
        }
    }
}