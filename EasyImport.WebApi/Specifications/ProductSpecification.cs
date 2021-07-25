using System;
using System.Linq.Expressions;
using EasyImport.WebApi.Models;
using EasyImport.WebApi.Specification;

namespace EasyImport.WebApi.Specifications
{
    public class ProductSpecification : BaseSpecification<Product>
    {
        public ProductSpecification()
        {
            AddInclude(x => x.Ncm);
            AddInclude(x => x.Supplier);
            AddInclude(x => x.Category);
            AddOrderBy(x => x.ProductCode);
        }

        public ProductSpecification(int id) : base(x => x.Id == id)
        {
            AddInclude(x => x.Ncm);
            AddInclude(x => x.Supplier);
            AddInclude(x => x.Category);
            AddOrderBy(x => x.ProductCode);
        }
        public ProductSpecification(ProductSpecParams productParams) : base(x =>
             (string.IsNullOrEmpty(productParams.Search) || x.ProductCode.ToLower().Contains(productParams.Search)
            || x.Description.ToLower().Contains(productParams.Search)
             || x.Category.Name.ToLower().Contains(productParams.Search)
             || x.Supplier.CompanyName.ToLower().Contains(productParams.Search)
             )

             &&
              (!productParams.CategoryId.HasValue || x.CategoryId == productParams.CategoryId) &&
              (!productParams.SupplierId.HasValue || x.SupplierId == productParams.SupplierId)
              )
        {
            AddInclude(x => x.Ncm);
            AddInclude(x => x.Supplier);
            AddInclude(x => x.Category);
            AddOrderBy(x => x.ProductCode);
            ApplyPaging(productParams.PageSize * (productParams.PageIndex - 1), productParams.PageSize);


            if (!string.IsNullOrEmpty(productParams.Sort))
            {
                switch (productParams.Sort)
                {
                    case "productAsc":
                        AddOrderBy(x => x.ProductCode);
                        break;
                    case "productDesc":
                        AddOrderByDescending(x => x.ProductCode);
                        break;
                    case "priceAsc":
                        AddOrderBy(x => x.Price);
                        break;
                    case "priceDesc":
                        AddOrderByDescending(x => x.Price);
                        break;
                    default:
                        AddOrderBy(x => x.ProductCode);
                        break;
                }
            }
        }
    }
}