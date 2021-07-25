using System;

namespace EasyImport.WebApi.Dtos
{
    public class PaymentDetailsDto
    {
        public int Id { get; set; }
        public decimal? DepositAmount { get; set; }
        public decimal? BalanceAmount { get; set; }
        public DateTime? DateDepositPaid { get; set; }
        public DateTime? DateBalancePaid { get; set; }
        public bool DepositPaid { get; set; }
        public bool BalancePaid { get; set; }
    }
}