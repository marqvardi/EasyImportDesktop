namespace EasyImport.WebApi.Dtos.Order
{
    public class OrderHandleItem
    {
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}