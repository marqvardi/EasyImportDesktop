using System;
using System.Linq.Expressions;
using EasyImport.WebApi.Models;
using EasyImport.WebApi.Specification;

namespace EasyImport.WebApi.Specifications
{
    public class ProductWithFiltersForCountSpecification : BaseSpecification<Product>
    {
        public ProductWithFiltersForCountSpecification(ProductSpecParams productParams) : base(x =>
            (string.IsNullOrEmpty(productParams.Search) || x.ProductCode.ToLower().Contains(productParams.Search)
               || x.Description.ToLower().Contains(productParams.Search)
             || x.Category.Name.ToLower().Contains(productParams.Search)
             || x.Supplier.CompanyName.ToLower().Contains(productParams.Search)
            
            ))
        {
        }
    }
}