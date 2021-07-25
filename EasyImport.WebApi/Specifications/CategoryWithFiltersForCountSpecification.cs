using EasyImport.WebApi.Models;
using EasyImport.WebApi.Specification;

namespace EasyImport.WebApi.Specifications
{
    public class CategoryWithFiltersForCountSpecification : BaseSpecification<Category>
    {
        public CategoryWithFiltersForCountSpecification(CategorySpecParams categoryParams) : base(x =>
            (string.IsNullOrEmpty(categoryParams.Search) || x.Name.ToLower().Contains(categoryParams.Search)))
        {

        }

    }
}