using EasyImport.WebApi.Models;
using EasyImport.WebApi.Specification;

namespace EasyImport.WebApi.Specifications
{
    public class SupplierWithFiltersForCountSpecification : BaseSpecification<Supplier>
    {
        public SupplierWithFiltersForCountSpecification(SupplierSpecParams categoryParams) : base(x =>
          (string.IsNullOrEmpty(categoryParams.Search) || x.CompanyName.ToLower().Contains(categoryParams.Search)))
        {

        }
    }
}