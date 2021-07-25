namespace EasyImport.WebApi.Dtos.Product
{
    public class ProductListForOrder
    {
         public int Id { get; set; }

        public string ProductCode { get; set; }
  
        public string Description { get; set; }

        public string Image { get; set; }

        public string PublicId { get; set; }
    }
}