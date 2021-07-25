using EasyImport.WebApi.Models;
using EasyImport.WebApi.Specification;

namespace EasyImport.WebApi.Specifications
{
    public class OrderStatusDoneWithFiltersForCountSpecification : BaseSpecification<Order>
    {
        public OrderStatusDoneWithFiltersForCountSpecification(OrderSpecParams orderParams) : base(x =>
             (
                 x.OrderStatusId == 4 &&
                 string.IsNullOrEmpty(orderParams.Search)
              || x.SupplierName.ToLower().Contains(orderParams.Search)

        ))
        {

        }
    }
}