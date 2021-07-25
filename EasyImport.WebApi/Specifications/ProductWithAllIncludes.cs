using EasyImport.WebApi.Models;
using EasyImport.WebApi.Specification;

namespace EasyImport.WebApi.Specifications
{
    public class ProductWithAllIncludes : BaseSpecification<Product>
    {
        public ProductWithAllIncludes()
        {
            AddInclude(x => x.Ncm);
            AddInclude(x => x.Supplier);
            AddInclude(x => x.Category);
        }
    }
}