using System;
using System.Collections.Generic;

namespace EasyImport.WebApi.Dtos.Order
{
    public class OrderEditDto
    {
        public int Id { get; set; }
        public string InvoiceNumber { get; set; }
        public string ReferenceNumber { get; set; }
        public DateTime DeliveryDate { get; set; }
        public DateTime OrderCreated { get; set; }
        public DateTime? ArrivalDate { get; set; }
        public DateTime? OrderCompletedOn { get; set; }
        public string SupplierName { get; set; }
        public int SupplierId { get; set; }
        public int OrderStatusId { get; set; }
        public decimal? DepositAmount { get; set; }
        public decimal? BalanceAmount { get; set; }
        public DateTime? DateDepositPaid { get; set; }
        public DateTime? DateBalancePaid { get; set; }
        public bool DepositPaid { get; set; }
        public bool BalancePaid { get; set; }
        public decimal TotalValueAllOrders { get; set; }

        public virtual ICollection<OrderItemDto> OrderItems { get; set; }
    }
}