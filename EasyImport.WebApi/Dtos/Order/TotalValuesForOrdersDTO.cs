namespace EasyImport.WebApi.Dtos.Order
{
    public class TotalValuesForOrdersDTO
    {
        public decimal TotalValueForAllOrders { get; set; }
        public decimal TotalTaxesValueForAllOrders { get; set; }

        public decimal TotalValuePaid { get; set; }
        public decimal TotalValueNotPaid { get; set; }
    }
}