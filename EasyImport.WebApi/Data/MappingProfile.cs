using AutoMapper;
using EasyImport.WebApi.Dtos;
using EasyImport.WebApi.Dtos.Ncm;
using EasyImport.WebApi.Dtos.Order;
using EasyImport.WebApi.Dtos.Product;
using EasyImport.WebApi.Dtos.Supplier;
using EasyImport.WebApi.Dtos.User;
using EasyImport.WebApi.Helpers;
using EasyImport.WebApi.Models;


namespace EasyImport.WebApi.Data
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {

            CreateMap<Photo, PhotoToReturnDto>().ReverseMap();
            CreateMap<Photo, PhotoForCreationDto>().ReverseMap();

            CreateMap<Product, ProductCreateDto>().ReverseMap();
            CreateMap<Supplier, SupplierDto>().ReverseMap();
            CreateMap<Supplier, SupplierToReturnDto>().ReverseMap();
            CreateMap<NCM, NcmDto>().ReverseMap();
            CreateMap<CategoryDto, Category>().ReverseMap();
            CreateMap<CategoryToReturnDto, Category>().ReverseMap();
            CreateMap<User, UserForListDto>().ReverseMap();
            CreateMap<User, UserForRegisterDto>().ReverseMap();
            CreateMap<User, UserDetailsToReturnDto>().ReverseMap();
            CreateMap<User, UserToReturnDto>().ReverseMap();
            CreateMap<User, UserToEditDto>().ReverseMap();

            CreateMap<OrderEditDto, Order>()
            .ReverseMap();


            CreateMap<OrderItem, OrderItemDto>().ReverseMap();

            CreateMap<Product, ProductListForOrder>().ReverseMap();

            CreateMap<OrderDetails, Order>()
                        .ForMember(dest => dest.ArrivalDate, opt => opt.MapFrom(src => src.ArrivalDate))
                        .ForMember(dest => dest.DeliveryDate, opt => opt.MapFrom(src => src.DeliveryDate))
                        .ForMember(dest => dest.InvoiceNumber, opt => opt.MapFrom(src => src.InvoiceNumber))
                        // .ForMember(dest => dest.OrderCompletedOn, opt => opt.MapFrom(src => src.OrderCompletedOn))
                        .ForMember(dest => dest.OrderCreated, opt => opt.MapFrom(src => src.OrderCreated))
                        .ForMember(dest => dest.ReferenceNumber, opt => opt.MapFrom(src => src.ReferenceNumber))
                        .ForMember(dest => dest.SupplierName, opt => opt.MapFrom(src => src.SupplierName))
                        .ReverseMap();

            CreateMap<Product, OrderItem>()
                    .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.Id))
                    .ForMember(dest => dest.II, opt => opt.MapFrom(src => src.Ncm.II))
                    .ForMember(dest => dest.PIS, opt => opt.MapFrom(src => src.Ncm.PIS))
                    .ForMember(dest => dest.Cofins, opt => opt.MapFrom(src => src.Ncm.COFINS))
                    .ForMember(dest => dest.IPI, opt => opt.MapFrom(src => src.Ncm.IPI))
                 .ForMember(dest => dest.PictureUrl, opt => opt.MapFrom(src => src.Image))
                    .ReverseMap();

            CreateMap<Product, ProductToReturnDto>()
                .ForMember(dest => dest.NcmCode, opt => opt.MapFrom(src => src.Ncm.NcmCode))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.SupplierName, opt => opt.MapFrom(src => src.Supplier.CompanyName))
                .ForMember(dest => dest.II, opt => opt.MapFrom(src => src.Ncm.II))
                .ForMember(dest => dest.PIS, opt => opt.MapFrom(src => src.Ncm.PIS))
                .ForMember(dest => dest.IPI, opt => opt.MapFrom(src => src.Ncm.IPI))
                .ForMember(dest => dest.Cofins, opt => opt.MapFrom(src => src.Ncm.COFINS))
                .ReverseMap();
        }
    }
}
