using EasyImport.WebApi.Models;
using EasyImport.WebApi.Specification;

namespace EasyImport.WebApi.Specifications
{
    public class OrderTotalSpecification : BaseSpecification<Order>
    {
        public OrderTotalSpecification()
        {
            AddInclude(x => x.OrderItems);
        }
    }
}