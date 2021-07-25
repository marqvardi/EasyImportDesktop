using EasyImport.WebApi.Models;
using EasyImport.WebApi.Specification;

namespace EasyImport.WebApi.Specifications
{
    public class OrderSpecification : BaseSpecification<Order>
    {
        public OrderSpecification()
        {
            AddInclude(x => x.OrderItems);
        }

        public OrderSpecification(int id) : base(x => x.Id == id)
        {
            AddInclude(x => x.OrderItems);
        }
        public OrderSpecification(OrderSpecParams orderParams) : base(x =>
        x.OrderStatusId != 4 &&
           (string.IsNullOrEmpty(orderParams.Search)
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
                    case "deliveryDateAsc":
                        AddOrderBy(x => x.DeliveryDate);
                        break;
                    case "deliveryDateDesc":
                        AddOrderByDescending(x => x.DeliveryDate);
                        break;
                    // case "orderStatusPending":
                    //     AddOrderByDescending(x => x.DeliveryDate);
                    //     break;
                    // case "orderStatusDone":
                    //     AddOrderByDescending(x => x.DeliveryDate);
                    //     break;
                    default:
                        AddOrderBy(x => x.DeliveryDate);
                        break;
                }
            }

        }


    }
}