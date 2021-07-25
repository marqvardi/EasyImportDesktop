using EasyImport.WebApi.Models;
using EasyImport.WebApi.Specification;

namespace EasyImport.WebApi.Specifications
{
    public class SupplierSpecification : BaseSpecification<Supplier>
    {
        public SupplierSpecification(SupplierSpecParams categoryParams) : base(x =>
           (string.IsNullOrEmpty(categoryParams.Search) || x.CompanyName.ToLower().Contains(categoryParams.Search)))
        {
            AddOrderBy(x => x.CompanyName);
            ApplyPaging(categoryParams.PageSize * (categoryParams.PageIndex - 1), categoryParams.PageSize);

            if (!string.IsNullOrEmpty(categoryParams.Sort))
            {
                switch (categoryParams.Sort)
                {
                    case "companyAsc":
                        AddOrderBy(x => x.CompanyName);
                        break;
                    case "companyDesc":
                        AddOrderByDescending(x => x.CompanyName);
                        break;
                    default:
                        AddOrderBy(x => x.CompanyName);
                        break;
                }
            }
        }
    }
}