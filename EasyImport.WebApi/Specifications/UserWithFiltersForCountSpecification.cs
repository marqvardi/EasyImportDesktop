using EasyImport.WebApi.Models;
using EasyImport.WebApi.Specification;

namespace EasyImport.WebApi.Specifications
{
    public class UserWithFiltersForCountSpecification : BaseSpecification<User>
    {
        public UserWithFiltersForCountSpecification(UserSpecParams userParams) : base(x =>
         (string.IsNullOrEmpty(userParams.Search) || x.UserName.ToLower().Contains(userParams.Search)
           || x.LastName.ToLower().Contains(userParams.Search)
          || x.UserName.ToLower().Contains(userParams.Search)))
        {

        }

    }
}