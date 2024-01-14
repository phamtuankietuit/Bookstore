using AutoMapper;
using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Models.Shared;
using Microsoft.Azure.Cosmos.Linq;

namespace BookstoreWebAPI.Utils
{
    public class MappingProfile : Profile
    {
        public MappingProfile() 
        {
            CreateMap<ProductDTO, ProductDocument>()
                .ForMember(dest => dest.Id, act => act.MapFrom(src => src.ProductId))
                .ForMember(dest => dest.Sku, act => act.MapFrom(src => src.ProductId))
                .ForMember(dest => dest.Ratings, act => act.Ignore())
                .ForMember(dest => dest.IsRemovable, act => act.MapFrom(src => true))
                .ForMember(dest => dest.IsDeleted, act => act.MapFrom(src => false))
                .ForMember(dest => dest.TTL, act => act.MapFrom(src => -1));

            CreateMap<ProductDTO, InventoryDocument>()
                .ForMember(dest => dest.Id, act => act.Ignore())
                .ForMember(dest => dest.LastRestocked, act => act.Ignore())
                .ForMember(dest => dest.IsRemovable, act => act.MapFrom(src => true)) 
                .ForMember(dest => dest.IsDeleted, act => act.MapFrom(src => false)) 
                .ForMember(dest => dest.TTL, act => act.MapFrom(src => -1));

            CreateMap<(ProductDocument, InventoryDocument), ProductDTO>()
                .ForMember(dest => dest.ProductId, act => act.MapFrom(src => src.Item1.ProductId))
                .ForMember(dest => dest.CategoryId, act => act.MapFrom(src => src.Item1.CategoryId))
                .ForMember(dest => dest.CategoryName, act => act.MapFrom(src => src.Item1.CategoryName))
                .ForMember(dest => dest.CategoryText, act => act.MapFrom(src => src.Item1.CategoryText))
                .ForMember(dest => dest.SupplierId, act => act.MapFrom(src => src.Item1.SupplierId))
                .ForMember(dest => dest.SupplierName, act => act.MapFrom(src => src.Item1.SupplierName))
                .ForMember(dest => dest.Sku, act => act.MapFrom(src => src.Item1.Sku))
                .ForMember(dest => dest.Name, act => act.MapFrom(src => src.Item1.Name))
                .ForMember(dest => dest.Description, act => act.MapFrom(src => src.Item1.Description))
                .ForMember(dest => dest.SalePrice, act => act.MapFrom(src => src.Item1.SalePrice))
                .ForMember(dest => dest.PurchasePrice, act => act.MapFrom(src => src.Item1.PurchasePrice))
                .ForMember(dest => dest.OptionalDetails, act => act.MapFrom(src => src.Item1.OptionalDetails))
                .ForMember(dest => dest.Details, act => act.MapFrom(src => src.Item1.Details))
                .ForMember(dest => dest.IsActive, act => act.MapFrom(src => src.Item1.IsActive))
                .ForMember(dest => dest.CreatedAt, act => act.MapFrom(src => src.Item1.CreatedAt))
                .ForMember(dest => dest.ModifiedAt, act => act.MapFrom(src => src.Item1.ModifiedAt))
                .ForMember(dest => dest.Images, act => act.MapFrom(src => src.Item1.Images))
                .ForMember(dest => dest.Tags, act => act.MapFrom(src => src.Item1.Tags))
                .ForMember(dest => dest.StaffId, act => act.MapFrom(src =>src.Item1.StaffId))

                .ForMember(dest => dest.Status, act => act.MapFrom(src => src.Item2.Status))
                .ForMember(dest => dest.Barcode, act => act.MapFrom(src => src.Item2.Barcode))
                .ForMember(dest => dest.MinStock, act => act.MapFrom(src => src.Item2.MinStock))
                .ForMember(dest => dest.MaxStock, act => act.MapFrom(src => src.Item2.MaxStock))
                .ForMember(dest => dest.CurrentStock, act => act.MapFrom(src => src.Item2.CurrentStock))
           ;


            CreateMap<CategoryDocument, CategoryDTO>();
            CreateMap<CategoryDTO, CategoryDocument>()
                .ForMember(dest => dest.Id, act => act.MapFrom(src => src.CategoryId))
                .ForMember(dest => dest.IsRemovable, act => act.MapFrom(src => true))
                .ForMember(dest => dest.IsDeleted, act => act.MapFrom(src => false))
                .ForMember(dest => dest.TTL, act => act.MapFrom(src => -1));

            
            CreateMap<SupplierDocument, SupplierDTO>();
            CreateMap<SupplierDTO, SupplierDocument>()
                .ForMember(dest => dest.Id, act => act.MapFrom(src => src.SupplierId))
                .ForMember(dest => dest.IsRemovable, act => act.MapFrom(src => true))
                .ForMember(dest => dest.IsDeleted, act => act.MapFrom(src => false))
                .ForMember(dest => dest.TTL, act => act.MapFrom(src => -1));
            

            CreateMap<CustomerDocument, CustomerDTO>();
            CreateMap<CustomerDTO, CustomerDocument>()
                .ForMember(dest => dest.Id, act => act.MapFrom(src => src.CustomerId))
                .ForMember(dest => dest.IsRemovable, act => act.MapFrom(src => true))
                .ForMember(dest => dest.IsDeleted, act => act.MapFrom(src => false))
                .ForMember(dest => dest.TTL, act => act.MapFrom(src => -1));


            CreateMap<SupplierGroupDocument, SupplierGroupDTO>();
            CreateMap<SupplierGroupDTO, SupplierGroupDocument>()
                .ForMember(dest => dest.Id, act => act.MapFrom(src => src.SupplierGroupId))
                .ForMember(dest => dest.IsRemovable, act => act.MapFrom(src => true))
                .ForMember(dest => dest.IsDeleted, act => act.MapFrom(src => false))
                .ForMember(dest => dest.TTL, act => act.MapFrom(src => -1));


            CreateMap<PurchaseOrderDocument, PurchaseOrderDTO>()
                .ForMember(dest => dest.Note, act => act.MapFrom(src => src.Note));

            CreateMap<PurchaseOrderDTO, PurchaseOrderDocument>()
                .ForMember(dest => dest.Id, act => act.MapFrom(src => src.PurchaseOrderId))
                .ForMember(dest => dest.TTL, act => act.MapFrom(src => -1));


            CreateMap<SalesOrderDocument, SalesOrderDTO>();
            CreateMap<SalesOrderDTO, SalesOrderDocument>()
                .ForMember(dest => dest.Id, act => act.MapFrom(src => src.SalesOrderId))
                .ForMember(dest => dest.MonthYear, act => act.MapFrom(src => src.CreatedAt != null ? src.CreatedAt.Value.ToString("MM-yyyy") : null))
                .ForMember(dest => dest.TTL, act => act.MapFrom(src => -1));


            CreateMap<PromotionDocument, PromotionDTO>();
            CreateMap<PromotionDTO, PromotionDocument>()
                .ForMember(dest => dest.Id, act => act.MapFrom(src => src.PromotionId))
                .ForMember(dest => dest.IsRemovable, act => act.MapFrom(src => true))
                .ForMember(dest => dest.IsDeleted, act => act.MapFrom(src => false))
                .ForMember(dest => dest.TTL, act => act.MapFrom(src => -1));

            CreateMap<StaffDocument, StaffDTO>();
            CreateMap<StaffDTO, StaffDocument>()
                .ForMember(dest => dest.Id, act => act.MapFrom(src => src.StaffId))
                .ForMember(dest => dest.TTL, act => act.MapFrom(src => -1));

            CreateMap<ActivityLogDocument, ActivityLogDTO>();
            CreateMap<ActivityLogDTO, ActivityLogDocument>()
                .ForMember(dest => dest.Id, act => act.MapFrom(src => src.StaffId))
                .ForMember(dest => dest.TTL, act => act.MapFrom(src => 604800));


            CreateMap<AdjustmentItemDocument, AdjustmentItemDTO>();
            CreateMap<AdjustmentItemDTO, AdjustmentItemDocument>()
                .ForMember(dest => dest.Id, act => act.MapFrom(src => src.AdjustmentItemId))
                .ForMember(dest => dest.TTL, act => act.MapFrom(src => -1));

            CreateMap<AdjustmentTicketDocument, AdjustmentTicketDTO>();
            CreateMap<AdjustmentTicketDTO, AdjustmentTicketDocument>()
                .ForMember(dest => dest.Id, act => act.MapFrom(src => src.AdjustmentTicketId))
                .ForMember(dest => dest.TTL, act => act.MapFrom(src => -1));

            CreateMap<LocationDocument, LocationDTO>();
            CreateMap<LocationDTO, LocationDocument>()
                .ForMember(dest => dest.Id, act => act.MapFrom(src => src.LocationId))
                .ForMember(dest => dest.TTL, act => act.MapFrom(src => -1));
            
            CreateMap<ReturnOrderDocument, ReturnOrderDTO>();
            CreateMap<ReturnOrderDTO, ReturnOrderDocument>()
                .ForMember(dest => dest.Id, act => act.MapFrom(src => src.ReturnOrderId))
                .ForMember(dest => dest.TTL, act => act.MapFrom(src => -1));

            CreateMap<ReturnOrderItem, SalesOrderItem>()
                .ForMember(dest => dest.Quantity, act => act.MapFrom(src => src.SoldQuantity));

            CreateMap<SalesOrderItem, ReturnOrderItem>()
                .ForMember(dest => dest.SoldQuantity, act => act.MapFrom(src => src.Quantity));


            CreateMap<AdjustmentItemDocument, AdjustmentItemDTO>();
            CreateMap<AdjustmentItemDTO, AdjustmentItemDocument>()
                .ForMember(dest => dest.Id, act => act.MapFrom(src => src.AdjustmentItemId))
                .ForMember(dest => dest.TTL, act => act.MapFrom(src => -1));

            CreateMap<AdjustmentTicketDocument, AdjustmentTicketDTO>();
            CreateMap<AdjustmentTicketDTO, AdjustmentTicketDocument>()
                .ForMember(dest => dest.Id, act => act.MapFrom(src => src.AdjustmentTicketId))
                .ForMember(dest => dest.TTL, act => act.MapFrom(src => -1));
        }
    }
}
