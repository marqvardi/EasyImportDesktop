
using AutoMapper;
using EasyImport.WebApi.Dtos.Product;
using EasyImport.WebApi.Models;
using Microsoft.Extensions.Configuration;

namespace EasyImport.WebApi.Helpers
{
    public class ProductUrlResolver : IValueResolver<Product, ProductToReturnDto, string>
    {
        private readonly IConfiguration _config;

        public ProductUrlResolver(IConfiguration config)
        {
            this._config = config;
        }

        public string Resolve(Product source, ProductToReturnDto destination, string destMember, ResolutionContext context)
        {
            if (!string.IsNullOrEmpty(source.Image))
            {
                return _config["ApiUrl"] + source.Image;
            }

            return null;
        }
    }
}