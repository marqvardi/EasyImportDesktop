using System.Collections.Generic;

namespace EasyImport.WebApi.Dtos
{
    public class PriceEvolution
    {
        public List<int> ProductIds { get; set; }
        public List<decimal> Prices { get; set; }
        public List<string> References { get; set; }
    }
}