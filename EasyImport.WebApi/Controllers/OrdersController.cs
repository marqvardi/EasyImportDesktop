using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EasyImport.WebApi.Models;
using EasyImport.WebApi.Data;
using AutoMapper;
using System.Collections.Generic;
using System;
using EasyImport.WebApi.Specifications;
using EasyImport.WebApi.Helpers;
using EasyImport.WebApi.Dtos;
using EasyImport.WebApi.Dtos.Order;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace EasyImport.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Policy = "RequireAdminRole")]
    [Authorize(Roles = "Admin, SimpleUser")]
    public class OrdersController : ControllerBase
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IMapper mapper;
        private readonly IGenericRepository<OrderItem> repositoryOrderItem;
        private readonly IGenericRepository<OrderDetails> repositoryOrderDetails;
        private readonly IGenericRepository<Product> repositoryProduct;
        private readonly IGenericRepository<Supplier> repositorySupplier;
        private readonly IGenericRepository<Order> repositoryOrder;
        private readonly IGenericRepository<OrderStatus> repositoryOrderStatus;
        private readonly DataContext _context;

        public OrdersController(DataContext context, IGenericRepository<OrderStatus> repositoryOrderStatus, IGenericRepository<OrderDetails> repositoryOrderDetails, IGenericRepository<OrderItem> repositoryOrderItem,
                                IMapper mapper, IUnitOfWork unitOfWork, IGenericRepository<Product> repositoryProduct,
                                IGenericRepository<Supplier> repositorySupplier, IGenericRepository<Order> repositoryOrder)
        {
            this.repositoryOrder = repositoryOrder;
            this.repositoryOrderStatus = repositoryOrderStatus;
            this.repositoryProduct = repositoryProduct;
            this.repositorySupplier = repositorySupplier;
            this.repositoryOrderDetails = repositoryOrderDetails;
            this.repositoryOrderItem = repositoryOrderItem;
            this.mapper = mapper;
            this.unitOfWork = unitOfWork;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<Pagination<OrderEditDto>>> GetOrders([FromQuery] OrderSpecParams orderParams)
        {
            if (orderParams.OrderStatusId == 4)
            {
                var spec = new OrderStatusDoneSpecification(orderParams);

                var countSpec = new OrderStatusDoneWithFiltersForCountSpecification(orderParams);

                var totalItems = await repositoryOrder.CountAsync(countSpec);

                var OrderFromRepo = await repositoryOrder.ListAsync(spec);

                var orderTotals = GetTotalValues(orderParams.OrderStatusId).Result;

                var ordersToReturn = mapper.Map<IReadOnlyList<OrderEditDto>>(OrderFromRepo);

                return Ok(new Pagination<OrderEditDto>(orderParams.PageIndex, orderParams.PageSize,
                            totalItems, ordersToReturn, orderTotals.TotalValueOfAllOrders, orderTotals.TotalTaxesValueOfAllOrders));
            }
            else
            {
                // var orders = _context.Order.Include(X => X.OrderItems).ThenInclude(x => x.Product).ToList();

                var spec = new OrderSpecification(orderParams);

                var countSpec = new OrderWithFiltersForCountSpecification(orderParams);

                var totalItems = await repositoryOrder.CountAsync(countSpec);

                var OrderFromRepo = await repositoryOrder.ListAsync(spec);

                var orderTotals = GetTotalValues(orderParams.OrderStatusId).Result;

                var ordersToReturn = mapper.Map<IReadOnlyList<OrderEditDto>>(OrderFromRepo);

                return Ok(new Pagination<OrderEditDto>(orderParams.PageIndex, orderParams.PageSize, totalItems,
                             ordersToReturn, orderTotals.TotalValueOfAllOrders, orderTotals.TotalTaxesValueOfAllOrders));
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderEditDto>> GetOrderbyId(int id)
        {
            var spec = new OrderSpecification(id);
            var OrderFromRepo = await repositoryOrder.GetEntityWithSpec(spec);

            if (OrderFromRepo == null) return NotFound("Order not found");

            var OrderToReturn = mapper.Map<OrderEditDto>(OrderFromRepo);

            return Ok(OrderToReturn);
        }

        [HttpPost("ModifyItemPrice")]
        public async Task<ActionResult> ModifyItemPrice(OrderHandleItem orderHandle)
        {
            var spec = new OrderHandleSpecification(orderHandle);

            var orderItemFromRepo = await repositoryOrderItem.GetEntityWithSpec(spec);

            if (orderItemFromRepo == null) return NotFound("Order not found");

            orderItemFromRepo.Price = orderHandle.Price;
            repositoryOrderItem.Update(orderItemFromRepo);
            var productFromRepo = repositoryProduct.GetByIdAsync(orderHandle.ProductId).Result;
            productFromRepo.Price = orderHandle.Price;

            var result = await unitOfWork.Complete();

            if (result >= 0)
                return Ok();

            return BadRequest("Failed to modify price");
        }


        [HttpPost("ModifyItemQuantity")]
        public async Task<ActionResult> ModifyItemQuantity(OrderHandleItem orderHandle)
        {
            var spec = new OrderHandleSpecification(orderHandle);

            var orderItemFromRepo = await repositoryOrderItem.GetEntityWithSpec(spec);

            if (orderItemFromRepo == null) return NotFound("Order not found");

            orderItemFromRepo.Quantity = orderHandle.Quantity;
            repositoryOrderItem.Update(orderItemFromRepo);

            var result = await unitOfWork.Complete();

            if (result >= 0)
                return Ok();

            return BadRequest("Failed to modify price");
        }

        [HttpGet("getOrderStatus")]
        public async Task<ActionResult<IReadOnlyList<OrderStatus>>> GetOrderStatus()
        {
            var spec = new OrderStatusSpecification();

            var orderStatusList = await repositoryOrderStatus.ListAsync(spec);

            if (orderStatusList == null)
            {
                return StatusCode(500, "Internal server error....");
            }

            return Ok(orderStatusList);
        }

        [HttpPut]
        public async Task<ActionResult<Order>> EditOrder(OrderExporterDetails orderEditDto)
        {
            var orderFromRepo = await repositoryOrder.GetByIdAsync(orderEditDto.Id);

            if (orderFromRepo == null) return NotFound();

            orderFromRepo.InvoiceNumber = orderEditDto.InvoiceNumber;
            orderFromRepo.ReferenceNumber = orderEditDto.ReferenceNumber;
            orderFromRepo.OrderStatusId = orderEditDto.OrderStatusId;
            orderFromRepo.DeliveryDate = orderEditDto.DeliveryDate;
            orderFromRepo.ArrivalDate = orderEditDto.ArrivalDate;
            orderFromRepo.OrderCreated = orderEditDto.OrderCreated;

            var supplier = await repositorySupplier.GetByIdAsync(orderEditDto.SupplierId);
            orderFromRepo.SupplierName = supplier.CompanyName;

            repositoryOrder.Update(orderFromRepo);

            var result = await unitOfWork.Complete();

            var orderToReturn = mapper.Map<OrderEditDto>(orderFromRepo);

            if (result >= 0)
                return Ok(orderToReturn);

            return StatusCode(500, "Internal server error....");
        }

        [HttpPost("addItem")]
        public async Task<ActionResult> AddItem([FromBody] OrderHandleItem orderHandleItem)
        {
            var spec = new OrderSpecification(orderHandleItem.OrderId);

            var orderFromRepo = await repositoryOrder.GetEntityWithSpec(spec);

            if (orderFromRepo == null) return NotFound("Order not found");

            if (orderFromRepo.OrderItems.Any(x => x.ProductId == orderHandleItem.ProductId))
                return BadRequest("Product already exists");

            var specProduct = new ProductSpecification(orderHandleItem.ProductId);
            var productFromRepo = await repositoryProduct.GetEntityWithSpec(specProduct);

            var productToAdd = mapper.Map<OrderItem>(productFromRepo);
            productToAdd.OrderId = orderFromRepo.Id;
            productToAdd.Quantity = orderHandleItem.Quantity;
            productToAdd.SupplierName = productFromRepo.Supplier.CompanyName;
            productToAdd.Id = 0;

            repositoryOrderItem.Add(productToAdd);

            var result = await unitOfWork.Complete();

            if (result >= 0)
                return Ok();

            return StatusCode(500, "Internal server error....");
        }

        [HttpDelete("deleteItem")]
        public async Task<ActionResult> DeleteItem([FromBody] OrderHandleItem orderHandleItem)
        {
            var spec = new OrderHandleItemSpecification(orderHandleItem);

            var itemToDelete = await repositoryOrderItem.GetEntityWithSpec(spec);

            if (itemToDelete == null) return NotFound("Product not found");

            repositoryOrderItem.Delete(itemToDelete);

            var result = await unitOfWork.Complete();

            var specToReturn = new OrderSpecification(orderHandleItem.OrderId);
            var OrderToReturn = await repositoryOrder.GetEntityWithSpec(specToReturn);

            if (OrderToReturn.OrderItems.Count <= 0)
            {
                Task<ActionResult> task = DeleteOrder(OrderToReturn.Id);
                return Ok();
            }

            if (result >= 0)
                return Ok(OrderToReturn);

            return StatusCode(500, "Internal server error....");
        }

        [HttpGet("orderItem/{id}")]
        public async Task<ActionResult<List<OrderItem>>> GetOrderItemPrices(int id)
        {
            var productsList = await _context.OrderItem
                                .Where(x => x.ProductId == id)
                                .Include(x => x.Order)
                                .OrderBy(x => x.Order.OrderCreated)
                                .Take(8)
                                .ToListAsync();

            var productsToReturn = new PriceEvolution();
            var productIds = new List<int>();
            var prices = new List<decimal>();
            var references = new List<string>();

            foreach (var item in productsList)
            {
                productIds.Add(item.ProductId);
                prices.Add(item.Price);
                references.Add(item.Order.ReferenceNumber);
            }
            productsToReturn.ProductIds = productIds;
            productsToReturn.Prices = prices;
            productsToReturn.References = references;

            return Ok(productsToReturn);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteOrder(int id)
        {
            var orderFromRepo = await repositoryOrder.GetByIdAsync(id);
            if (orderFromRepo == null) return NotFound();

            repositoryOrder.Delete(orderFromRepo);
            var result = await unitOfWork.Complete();

            if (result >= 0)
                return Ok();

            return StatusCode(500, "Internal server error....");
        }

        [HttpPost]
        public async Task<ActionResult<OrderCreateDto>> CreateOrder(OrderCreateDto order)
        {
            if (order == null) return BadRequest("Order is empty");

            var created = await CreateOrderInDb(order);

            if (!created) return BadRequest("Failed to save in database");

            return Ok();
        }

        private async Task<OrderTotals> GetTotalValues(int? orderStatusId)
        {
            double ICMSbase = 0.82;
            double ICMS = 0.18;
            var spec = new OrderTotalSpecification();
            var AllOrders = await repositoryOrder.ListAsync(spec);

            if (orderStatusId < 4)
            {
                var totalValueForALlOrders = AllOrders.Where(x => x.OrderStatusId < 4)
                                     .Sum(e => e.OrderItems.Sum(d => d.Price * d.Quantity));

                // var totalTaxesValueForALlOrders = AllOrders.Where(x => x.OrderStatusId < 4);

                // var II = totalTaxesValueForALlOrders.Sum(e => e.OrderItems.Sum(d => d.Price * (decimal)d.II * (d.Quantity)));

                // var IPI = totalTaxesValueForALlOrders.Sum(e => e.OrderItems.Sum
                //                         (d => (d.Price * d.Quantity + d.Price * d.Quantity * (decimal)d.II) * (decimal)d.IPI));

                // var PIS = totalTaxesValueForALlOrders.Sum(e => e.OrderItems.Sum
                //                         (d => (d.Price * d.Quantity) * (decimal)d.PIS));

                // var COFINS = totalTaxesValueForALlOrders.Sum(e => e.OrderItems.Sum
                // (d => (d.Price * d.Quantity) * (decimal)d.Cofins));

                // var ICMSValue = ((totalValueForALlOrders + (II + IPI + PIS + COFINS)) / (decimal)ICMSbase) * (decimal)ICMS;


                var totalTaxesValueForALlOrders = AllOrders.Where(x => x.OrderStatusId < 4)
                                    .Sum(e => e.OrderItems.Sum(d =>
                                    // ii
                                    d.Price * (decimal)d.II * (d.Quantity) +
                                        //ipi
                                        (d.Price * d.Quantity + d.Price * d.Quantity * (decimal)d.II) * (decimal)d.IPI +
                                    //pis
                                    ((d.Price * d.Quantity) * (decimal)d.PIS) +
                                    //cofins
                                    ((d.Price * d.Quantity) * (decimal)d.Cofins) +
                                    //icms
                                       (((
                                           (d.Price * d.Quantity) +
                                           d.Price * (decimal)d.II * (d.Quantity) +
                                            (d.Price * d.Quantity + (d.Price * d.Quantity * (decimal)d.II)) * (decimal)d.IPI +
                                            ((d.Price * d.Quantity) * (decimal)d.PIS) +
                                            ((d.Price * d.Quantity) * (decimal)d.Cofins)
                                       ) / (decimal)ICMSbase) * (decimal)ICMS)
                                    ));

                var orderTotals = new OrderTotals();
                orderTotals.TotalValueOfAllOrders = totalValueForALlOrders;
                orderTotals.TotalTaxesValueOfAllOrders = totalTaxesValueForALlOrders;
                // orderTotals.TotalTaxesValueOfAllOrders = II + IPI + PIS + COFINS + ICMSValue;

                return orderTotals;
            }
            else
            {
                var totalValueForALlOrders = AllOrders.Where(x => x.OrderStatusId == 4)
                                     .Sum(e => e.OrderItems.Sum(d => d.Price * d.Quantity));


                var totalTaxesValueForALlOrders = AllOrders.Where(x => x.OrderStatusId == 4)
                                    .Sum(e => e.OrderItems.Sum(d =>
                                    // ii
                                    d.Price * (decimal)d.II * (d.Quantity) +
                                        //ipi
                                        (d.Price * d.Quantity + d.Price * d.Quantity * (decimal)d.II) * (decimal)d.IPI +
                                    //pis
                                    ((d.Price * d.Quantity) * (decimal)d.PIS) +
                                    //cofins
                                    ((d.Price * d.Quantity) * (decimal)d.Cofins) +
                                    //icms
                                       (((
                                           (d.Price * d.Quantity) +
                                           d.Price * (decimal)d.II * (d.Quantity) +
                                            (d.Price * d.Quantity + (d.Price * d.Quantity * (decimal)d.II)) * (decimal)d.IPI +
                                            ((d.Price * d.Quantity) * (decimal)d.PIS) +
                                            ((d.Price * d.Quantity) * (decimal)d.Cofins)
                                       ) / (decimal)ICMSbase) * (decimal)ICMS)
                                    ));

                var orderTotals = new OrderTotals();
                orderTotals.TotalValueOfAllOrders = totalValueForALlOrders;
                orderTotals.TotalTaxesValueOfAllOrders = totalTaxesValueForALlOrders;

                return orderTotals;
            }

        }

        private async Task<bool> CreateOrderInDb(OrderCreateDto order)
        {
            var orderToCreate = mapper.Map<Order>(order.OrderDetails);
            orderToCreate.OrderCreated = DateTime.Now;
            var supplierFromRepo = await repositorySupplier.GetByIdAsync(order.OrderDetails.SupplierId);
            orderToCreate.SupplierName = supplierFromRepo.CompanyName;
            // var orderStatus = await repositoryOrderStatus.GetByIdAsync(1);
            orderToCreate.OrderStatusId = 1;
            orderToCreate.BalanceAmount = 0;
            orderToCreate.DepositAmount = 0;

            repositoryOrder.Add(orderToCreate);
            await unitOfWork.Complete();

            foreach (var item in order.Basket.Items)
            {
                var spec = new ProductSpecification(item.ProductId);
                var productFromRepo1 = await repositoryProduct.GetEntityWithSpec(spec);

                var orderItem = mapper.Map<OrderItem>(productFromRepo1);
                orderItem.Quantity = item.Quantity;
                orderItem.OrderId = orderToCreate.Id;
                orderItem.Id = 0;
                orderItem.SupplierName = productFromRepo1.Supplier.CompanyName;
                repositoryOrderItem.Add(orderItem);
            }
            var completed = await unitOfWork.Complete();
            if (completed <= 0) return false;

            return true;
        }
    }
}