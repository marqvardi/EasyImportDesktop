using EasyImport.WebApi.Models;
using EasyImport.WebApi.Specification;

namespace EasyImport.WebApi.Specifications
{
    public class PaymentsFiltersForCountSpecification : BaseSpecification<Order>
    {
        public PaymentsFiltersForCountSpecification(OrderSpecParams orderSpecParams) : base(x =>
         !x.DepositPaid || !x.BalancePaid &&
            (string.IsNullOrEmpty(orderSpecParams.Search) || x.SupplierName.ToLower().Contains(orderSpecParams.Search)
               || x.ReferenceNumber.ToLower().Contains(orderSpecParams.Search)
            ))
        {

        }

    }
}