using EasyImport.WebApi.Models;
using EasyImport.WebApi.Specification;
using EasyImport.WebApi.Specifications;

namespace repos.EasyImport.Specifications
{
    public class CategorySpecification : BaseSpecification<Category>
    {
        public CategorySpecification(CategorySpecParams categoryParams) : base(x =>
            (string.IsNullOrEmpty(categoryParams.Search) || x.Name.ToLower().Contains(categoryParams.Search)))
        {
            AddOrderBy(x => x.Name);
            ApplyPaging(categoryParams.PageSize * (categoryParams.PageIndex - 1), categoryParams.PageSize);

            if (!string.IsNullOrEmpty(categoryParams.Sort))
            {
                switch (categoryParams.Sort)
                {
                    case "categoryAsc":
                        AddOrderBy(x => x.Name);
                        break;
                    case "categoryDesc":
                        AddOrderByDescending(x => x.Name);
                        break;
                    default:
                        AddOrderBy(x => x.Name);
                        break;
                }
            }
        }
    }
}