using System;
using System.Collections.Generic;
using EasyImport.WebApi.Models;

namespace EasyImport.WebApi.Dtos
{
    public class OrderDto
    {
        public IReadOnlyList<OrderItem> OrderItems { get; set; }
        public OrderDetails Orderdetails { get; set; }

        // public int Id { get; set; }
        // public int ProductId { get; set; }
        // public string ProductCode { get; set; }
        // public string Description { get; set; }
        // public decimal Price { get; set; }
        // public int Quantity { get; set; }
        // public int SupplierId { get; set; }
        // public string PictureUrl { get; set; }
        // public string Category { get; set; }
        // public string NCM { get; set; }
        // public string Supplier { get; set; }
        // public double CartonDeepness { get; set; }
        // public double CartonHeight { get; set; }
        // public double CartonWidth { get; set; }
        // public double GrossKgs { get; set; }
        // public int QtyPerCarton { get; set; }
        // public double II { get; set; }
        // public double PIS { get; set; }
        // public double Cofins { get; set; }

        // public string InvoiceNumber { get; set; }
        // public string ReferenceNumber { get; set; }
        // public DateTime DeliveryDate { get; set; }
        // public DateTime OrderCreated { get; set; }
        // public DateTime? ArrivalDate { get; set; }
        // public DateTime? OrderCompletedOn { get; set; }
        // public string SupplierName { get; set; }
    }
}