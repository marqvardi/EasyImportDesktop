using EasyImport.WebApi.Models;

namespace EasyImport.WebApi.Dtos.Product
{
    public class ProductToReturnDto
    {
        public int Id { get; set; }
        public string ProductCode { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public bool Active { get; set; }
        public double CartonWidth { get; set; }
        public double CartonHeight { get; set; }
        public double CartonDeepness { get; set; }
        public double NetKgs { get; set; }
        public double GrossKgs { get; set; }
        public decimal Price { get; set; }
        public int QtyPerCarton { get; set; }
        public string SupplierName { get; set; }
        public string NcmCode { get; set; }
        public string CategoryName { get; set; }
        public int SupplierId { get; set; }
        public int CategoryId { get; set; }
        public int NcmId { get; set; }
        public double II { get; set; }
        public double IPI { get; set; }
        public double PIS { get; set; }
        public double Cofins { get; set; }
        // public NCM NCM { get; set; }
    }
}