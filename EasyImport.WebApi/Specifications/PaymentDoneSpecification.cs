using EasyImport.WebApi.Models;
using EasyImport.WebApi.Specification;

namespace EasyImport.WebApi.Specifications
{
    public class PaymentDoneSpecification : BaseSpecification<Order>
    {
        public PaymentDoneSpecification(OrderSpecParams orderParams) : base(x =>
                 x.DepositPaid && x.BalancePaid &&
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
                    case "doneAsc":
                        AddOrderBy(x => x.ReferenceNumber);
                        break;
                    case "doneDesc":
                        AddOrderByDescending(x => x.ReferenceNumber);
                        break;
                    default:
                        AddOrderBy(x => x.ReferenceNumber);
                        break;
                }
            }
        }


    }

}