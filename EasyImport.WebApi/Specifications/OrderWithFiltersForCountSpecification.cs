using EasyImport.WebApi.Models;
using EasyImport.WebApi.Specification;

namespace EasyImport.WebApi.Specifications
{
    public class OrderWithFiltersForCountSpecification : BaseSpecification<Order>
    {
        public OrderWithFiltersForCountSpecification(OrderSpecParams orderParams) : base(x =>
             (
                 x.OrderStatusId != 4 &&
                 string.IsNullOrEmpty(orderParams.Search)
              || x.SupplierName.ToLower().Contains(orderParams.Search)

        ))
        {

        }
    }
}