using System.Collections.Generic;
using EasyImport.WebApi.Dtos.Order;

namespace EasyImport.WebApi.Helpers
{
    public class Pagination<T> where T : class
    {

        public Pagination(int pageIndex, int pageSize, int count, IReadOnlyList<T> data)
        {
            PageIndex = pageIndex;
            PageSize = pageSize;
            Count = count;
            Data = data;
        }

        public Pagination(int pageIndex, int pageSize, int count, IReadOnlyList<T> data,
                 decimal totalValueForAllOrders, decimal totalTaxesValueForAllOrders)
        {
            TotalTaxesValueForAllOrders = totalTaxesValueForAllOrders;
            TotalValueForAllOrders = totalValueForAllOrders;
            PageIndex = pageIndex;
            PageSize = pageSize;
            Count = count;
            Data = data;
        }

        public Pagination(int pageIndex, int pageSize, int count, IReadOnlyList<T> data,
                TotalValuesForOrdersDTO totalValuesForOrders)
        {
            TotalValuesForOrders = totalValuesForOrders;
            PageIndex = pageIndex;
            PageSize = pageSize;
            Count = count;
            Data = data;
        }

        public TotalValuesForOrdersDTO TotalValuesForOrders { get; set; }

        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public int Count { get; set; }
        public decimal TotalValueForAllOrders { get; set; }
        public decimal TotalTaxesValueForAllOrders { get; set; }
        public IReadOnlyList<T> Data { get; set; }
    }
}