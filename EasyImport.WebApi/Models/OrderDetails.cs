using System;

namespace EasyImport.WebApi.Models
{
    public class OrderDetails
    {
        public int Id { get; set; }
        public string InvoiceNumber { get; set; }
        public string ReferenceNumber { get; set; }
        public int SupplierId { get; set; }
        public DateTime DeliveryDate { get; set; }
        public DateTime OrderCreated { get; set; }
        public DateTime? ArrivalDate { get; set; }
        public DateTime? OrderCompletedOn { get; set; }
        public string SupplierName { get; set; }

        public OrderItem OrderItem { get; set; }
    }
}