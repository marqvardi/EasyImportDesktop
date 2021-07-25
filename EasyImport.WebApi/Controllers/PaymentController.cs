using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EasyImport.WebApi.Data;
using EasyImport.WebApi.Dtos;
using EasyImport.WebApi.Dtos.Order;
using EasyImport.WebApi.Helpers;
using EasyImport.WebApi.Models;
using EasyImport.WebApi.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EasyImport.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Policy = "RequireAdminRole")]
    [Authorize(Roles = "Admin, SimpleUser")]
    public class PaymentController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IGenericRepository<Order> _repository;
        private readonly IUnitOfWork _unitOfWork;
        public PaymentController(IGenericRepository<Order> repository, IMapper mapper, IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _repository = repository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<Pagination<OrderEditDto>>> GetOrders([FromQuery] OrderSpecParams orderParams)
        {
            if (orderParams.Sort == "pending" || orderParams.Sort == null)
            {
                var spec = new PaymentSpecification(orderParams);

                var countSpec = new PaymentsFiltersForCountSpecification(orderParams);

                var totalItems = await _repository.CountAsync(countSpec);

                var OrderFromRepo = await _repository.ListAsync(spec);

                var ordersToReturn = _mapper.Map<IReadOnlyList<OrderEditDto>>(OrderFromRepo);

                var TotalValueForAllOrders = GetTotalValuesForAllOrders(false).Result;

                var totalAmountDetailsForOrders = GetTotalAmountDetailsForOrders(false).Result;

                return Ok(new Pagination<OrderEditDto>(orderParams.PageIndex, orderParams.PageSize, totalItems, ordersToReturn, totalAmountDetailsForOrders));
            }
            else
            {
                var spec = new PaymentDoneSpecification(orderParams);

                var countSpec = new PaymentsDoneFiltersForCountSpecification(orderParams);

                var totalItems = await _repository.CountAsync(countSpec);

                var OrderFromRepo = await _repository.ListAsync(spec);

                var ordersToReturn = _mapper.Map<IReadOnlyList<OrderEditDto>>(OrderFromRepo);

                var TotalValueForAllOrders = GetTotalValuesForAllOrders(true).Result;

                var totalAmountDetailsForOrders = GetTotalAmountDetailsForOrders(true).Result;

                return Ok(new Pagination<OrderEditDto>(orderParams.PageIndex, orderParams.PageSize, totalItems, ordersToReturn, totalAmountDetailsForOrders));
            }
        }

        [HttpPost]
        public async Task<ActionResult> UpdateOrderPayment(PaymentDetailsDto paymentDetails)
        {
            var spec = new OrderSpecification(paymentDetails.Id);
            var OrderFromRepo = await _repository.GetEntityWithSpec(spec);

            if (OrderFromRepo == null) return NotFound("Order not found");

            OrderFromRepo.DateDepositPaid = paymentDetails.DateDepositPaid;
            OrderFromRepo.DepositAmount = paymentDetails.DepositAmount;
            OrderFromRepo.DepositPaid = paymentDetails.DepositPaid;
            OrderFromRepo.DateBalancePaid = paymentDetails.DateBalancePaid;
            OrderFromRepo.BalanceAmount = paymentDetails.BalanceAmount;
            OrderFromRepo.BalancePaid = paymentDetails.BalancePaid;

            _repository.Update(OrderFromRepo);

            var result = await _unitOfWork.Complete();

            if (result >= 0)
                return Ok();

            return BadRequest("Failed to modify payment details");
        }

        private async Task<TotalValuesForOrdersDTO> GetTotalAmountDetailsForOrders(bool orderCompleted)
        {
            var totalOrderDetails = new TotalValuesForOrdersDTO();

            var spec = new OrderTotalSpecification();
            var orders = await _repository.ListAsync(spec);
            decimal totalValuePaid = 0;

            if (orderCompleted)
            {
                totalOrderDetails.TotalValueForAllOrders = orders
                    .Where(d => d.DepositPaid == true && d.BalancePaid == true)
                    .Sum(f => f.OrderItems.Sum(h => h.Price * h.Quantity));

                totalOrderDetails.TotalValuePaid = orders
                    .Where(f => f.DepositPaid == true && f.BalancePaid == true)
                    .Sum(g => (decimal)g.BalanceAmount + (decimal)g.DepositAmount);

                return totalOrderDetails;
            }
            else
            {
                totalOrderDetails.TotalValueForAllOrders = orders
                    .Where(d => d.BalancePaid == false || d.DepositPaid == false)
                    .Sum(g => g.OrderItems.Sum(j => j.Price * j.Quantity));

                foreach (var item in orders.Where(d => d.BalancePaid == false || d.DepositPaid == false))
                {
                    if (item.BalancePaid == true)
                    {
                        totalValuePaid += (decimal)item.BalanceAmount;
                    }
                    if (item.DepositPaid == true)
                    {
                        totalValuePaid += (decimal)item.DepositAmount;
                    }
                }
            }

            totalOrderDetails.TotalValuePaid = totalValuePaid;
            return totalOrderDetails;
        }

        private decimal GetTotalAmountForAllOrders(IReadOnlyList<Order> orders, bool orderCompleted)
        {
            decimal totalValue = 0;

            if (orderCompleted == false)
            {
                return totalValue = orders
                                    .Where(c => c.BalancePaid == false || c.DepositPaid == false)
                                    .Sum(d => d.OrderItems.Sum(f => f.Price * f.Quantity));
            }
            else
            {
                return totalValue = orders
                                    .Where(c => c.BalancePaid == true && c.DepositPaid == true)
                                    .Sum(d => d.OrderItems.Sum(f => f.Price * f.Quantity));
            }
        }

        private async Task<decimal> GetTotalValuesForAllOrders(bool condition)
        {
            var spec = new OrderTotalSpecification();
            var orders = await _repository.ListAsync(spec);
            decimal totalValue = 0;

            if (condition == false)
            {
                return totalValue = orders
                                    .Where(c => c.BalancePaid == false || c.DepositPaid == false)
                                    .Sum(d => d.OrderItems.Sum(f => f.Price * f.Quantity));
            }
            else
            {
                return totalValue = orders
                                    .Where(c => c.BalancePaid == true && c.DepositPaid == true)
                                    .Sum(d => d.OrderItems.Sum(f => f.Price * f.Quantity));
            }
        }
    }
}