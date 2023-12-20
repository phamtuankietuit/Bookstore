using AutoMapper;
using SE100_BookstoreWebAPI.Models.Documents;
using SE100_BookstoreWebAPI.Models.DTOs;

namespace SE100_BookstoreWebAPI.Utils
{
    public class MappingProfile : Profile
    {
        public MappingProfile() 
        {
            CreateMap<ProductDTO, ProductDocument>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.ProductId))
                .ForMember(dest => dest.Ratings, opt => opt.Ignore())
                .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => false)) // Assuming this is handled elsewhere
                ;

            CreateMap<ProductDTO, InventoryDocument>()
                .ForMember(dest => dest.Id, opt => opt.Ignore()) // Assuming Id is generated elsewhere
                .ForMember(dest => dest.LastRestocked, opt => opt.Ignore()) // Handle this based on your logic
                .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => false)) // Assuming this is handled elsewhere
                ;

            CreateMap<(ProductDocument, InventoryDocument), ProductDTO>()
                .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.Item1.ProductId))
                .ForMember(dest => dest.CategoryId, opt => opt.MapFrom(src => src.Item1.CategoryId))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Item1.CategoryName))
                .ForMember(dest => dest.Sku, opt => opt.MapFrom(src => src.Item1.Sku))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Item1.Name))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Item1.Description))
                .ForMember(dest => dest.SalePrice, opt => opt.MapFrom(src => src.Item1.SalePrice))
                .ForMember(dest => dest.PurchasePrice, opt => opt.MapFrom(src => src.Item1.PurchasePrice))
                .ForMember(dest => dest.Attributes, opt => opt.MapFrom(src => src.Item1.Attributes))
                .ForMember(dest => dest.Details, opt => opt.MapFrom(src => src.Item1.Details))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.Item1.IsActive))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.Item1.CreatedAt))
                .ForMember(dest => dest.Images, opt => opt.MapFrom(src => src.Item1.Images))
                .ForMember(dest => dest.Tags, opt => opt.MapFrom(src => src.Item1.Tags))

                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Item2.Status))
                .ForMember(dest => dest.Barcode, opt => opt.MapFrom(src => src.Item2.Barcode))
                .ForMember(dest => dest.MinStock, opt => opt.MapFrom(src => src.Item2.MinStock))
                .ForMember(dest => dest.MaxStock, opt => opt.MapFrom(src => src.Item2.MaxStock))
                .ForMember(dest => dest.CurrentStock, opt => opt.MapFrom(src => src.Item2.CurrentStock))
            ;

            CreateMap<CategoryDocument, CategoryDTO>();

            CreateMap<CategoryDTO, CategoryDocument>()
                .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => false))
                .ForMember(dest => dest.TTL, opt => opt.MapFrom(src => -1))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.CategoryId));

            CreateMap<PurchaseOrderDTO, PurchaseOrderDocument>()
                .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => false))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.PurchaseOrderId));

            CreateMap<PurchaseOrderDocument, PurchaseOrderDTO>();

            CreateMap<SalesOrderDTO, SalesOrderDocument>()
                .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => false))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.OrderId));

            CreateMap<SalesOrderDocument, SalesOrderDTO>();

            CreateMap<SupplierDTO, SupplierDocument>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.SupplierId));

            CreateMap<SupplierDocument, SupplierDTO>();

            CreateMap<PromotionDocument, PromotionDTO>();

            CreateMap<PromotionDTO, PromotionDocument>();
        }
    }
}
