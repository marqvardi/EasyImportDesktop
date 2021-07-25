using EasyImport.WebApi.Models;
using EasyImport.WebApi.Specification;

namespace EasyImport.WebApi.Specifications
{
    public class NcmSpecification : BaseSpecification<NCM>
    {
        public NcmSpecification(NcmSpecParams ncmSpecParams) : base(x =>
            (string.IsNullOrEmpty(ncmSpecParams.Search) || x.NcmCode.ToLower().Contains(ncmSpecParams.Search)))
        {
            AddOrderBy(x => x.NcmCode);
            ApplyPaging(ncmSpecParams.PageSize * (ncmSpecParams.PageIndex - 1), ncmSpecParams.PageSize);

            if (!string.IsNullOrEmpty(ncmSpecParams.Sort))
            {
                switch (ncmSpecParams.Sort)
                {
                    case "ncmAsc":
                        AddOrderBy(x => x.NcmCode);
                        break;
                    case "ncmDesc":
                        AddOrderByDescending(x => x.NcmCode);
                        break;
                    default:
                        AddOrderBy(x => x.NcmCode);
                        break;
                }
            }
        }
    }
}