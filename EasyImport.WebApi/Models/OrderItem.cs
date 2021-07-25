namespace EasyImport.WebApi.Models
{
    public class OrderItem
    {
        public int Id { get; set; }

        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int SupplierId { get; set; }
        public string ProductCode { get; set; }
        public string SupplierName { get; set; }
        public string Description { get; set; }
        public string PictureUrl { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public double CartonWidth { get; set; }
        public double CartonHeight { get; set; }
        public double CartonDeepness { get; set; }
        public double NetKgs { get; set; }
        public double GrossKgs { get; set; }
        public int QtyPerCarton { get; set; }
        public double II { get; set; }
        public double PIS { get; set; }
        public double Cofins { get; set; }
        public double IPI { get; set; }

        public virtual Order Order { get; set; }
        public Product Product { get; set; }
        public Supplier Supplier { get; set; }

        //public OrderDetails OrderDetails { get; set; }
    }
}