using EasyImport.WebApi.Models;
using EasyImport.WebApi.Specification;

namespace EasyImport.WebApi.Specifications
{
    public class NcmWithFiltersForCountSpecification : BaseSpecification<NCM>
    {
        public NcmWithFiltersForCountSpecification(NcmSpecParams ncmSpecParams) : base(x =>
            (string.IsNullOrEmpty(ncmSpecParams.Search) || x.NcmCode.ToLower().Contains(ncmSpecParams.Search)))
        {

        }
    }
}