namespace EasyImport.WebApi.Models
{
    public class BasketItem
    {
        //public int Id { get; set; }

        public int ProductId { get; set; }
        public string ProductCode { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public int SupplierId { get; set; }
        public string PictureUrl { get; set; }
        public string Category { get; set; }
        public string NCM { get; set; }
        public string Supplier { get; set; }
        public double CartonDeepness { get; set; }
        public double CartonHeight { get; set; }
        public double CartonWidth { get; set; }
        public double GrossKgs { get; set; }
        public int QtyPerCarton { get; set; }
        public double II { get; set; }
        public double IPI { get; set; }
        public double PIS { get; set; }
        public double Cofins { get; set; }
    }
}