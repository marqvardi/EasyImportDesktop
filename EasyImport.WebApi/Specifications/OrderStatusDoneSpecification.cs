using EasyImport.WebApi.Models;
using EasyImport.WebApi.Specification;

namespace EasyImport.WebApi.Specifications
{
    public class OrderStatusDoneSpecification : BaseSpecification<Order>
    {
        public OrderStatusDoneSpecification(OrderSpecParams orderParams) : base(x =>
         (
                 x.OrderStatusId == 4 &&
             string.IsNullOrEmpty(orderParams.Search)
          || x.SupplierName.ToLower().Contains(orderParams.Search) || x.ReferenceNumber.Contains(orderParams.Search)

         ))
        {
            AddInclude(x => x.OrderItems);
            ApplyPaging(orderParams.PageSize * (orderParams.PageIndex - 1), orderParams.PageSize);

            if (!string.IsNullOrEmpty(orderParams.Sort))
            {
                switch (orderParams.Sort)
                {
                    case "supplierAsc":
                        AddOrderBy(x => x.SupplierName);
                        break;
                    case "supplierDesc":
                        AddOrderByDescending(x => x.SupplierName);
                        break;
                    case "arrivalDateAsc":
                        AddOrderByDescending(x => x.ArrivalDate);
                        break;
                    case "arrivalDateDesc":
                        AddOrderBy(x => x.ArrivalDate);
                        break;
                    // case "orderStatusAsc":
                    //     AddOrderBy(x => x.OrderStatus);
                    //     break;
                    // case "orderStatusDesc":
                    //     AddOrderByDescending(x => x.OrderStatus);
                    //     break;
                    default:
                        AddOrderBy(x => x.DeliveryDate);
                        break;
                }
            }

        }
    }
}