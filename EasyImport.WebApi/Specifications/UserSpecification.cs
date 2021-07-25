using EasyImport.WebApi.Models;
using EasyImport.WebApi.Specification;

namespace EasyImport.WebApi.Specifications
{
    public class UserSpecification : BaseSpecification<User>
    {
        public UserSpecification(UserSpecParams specParams) : base(x =>
           (string.IsNullOrEmpty(specParams.Search) || x.FirstName.ToLower().Contains(specParams.Search)
           || x.LastName.ToLower().Contains(specParams.Search)
           || x.UserName.ToLower().Contains(specParams.Search)
           )
           )
        {
            //AddInclude(x => x.UserRoles);
            AddInclude(x => x.Role);
            ApplyPaging(specParams.PageSize * (specParams.PageIndex - 1), specParams.PageSize);
            AddGroupBy(x => x.UserName);

            if (!string.IsNullOrEmpty(specParams.Sort))
            {
                switch (specParams.Sort)
                {
                    case "nameAsc":
                        AddOrderBy(x => x.UserName);
                        break;
                    case "nameDesc":
                        AddOrderByDescending(x => x.UserName);
                        break;
                    default:
                        AddOrderBy(x => x.UserName);
                        break;
                }
            }
        }
    }
}