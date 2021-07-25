using EasyImport.WebApi.Models;
using EasyImport.WebApi.Specification;

namespace EasyImport.WebApi.Specifications
{
    public class PaymentSpecification : BaseSpecification<Order>
    {
        public PaymentSpecification(OrderSpecParams orderParams) : base(x =>
                 !x.DepositPaid || !x.BalancePaid &&
           (string.IsNullOrEmpty(orderParams.Search)
            || x.SupplierName.ToLower().Contains(orderParams.Search)
           ))
        {
            AddInclude(x => x.OrderItems);
            ApplyPaging(orderParams.PageSize * (orderParams.PageIndex - 1), orderParams.PageSize);

            if (!string.IsNullOrEmpty(orderParams.Sort))
            {
                switch (orderParams.Sort)
                {
                    case "pending":
                        AddOrderByDescending(x => x.OrderStatusId);
                        break;
                    case "done":
                        AddOrderByDescending(x => x.OrderStatusId);
                        break;
                    default:
                        AddOrderByDescending(x => x.OrderStatusId);
                        break;
                }
            }
        }


    }
}