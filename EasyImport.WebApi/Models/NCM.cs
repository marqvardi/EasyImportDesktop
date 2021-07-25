using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EasyImport.WebApi.Models
{
    public class NCM
    {
        public int Id { get; set; }

        [Required]
        [StringLength(10)]
        public string NcmCode { get; set; }

        [Required]
        [Range(0, 1)]
        public double II { get; set; }

        [Range(0, 1)]
        public double IPI { get; set; }

        [Required]
        [Range(0, 1)]
        public double PIS { get; set; }

        [Required]
        [Range(0, 1)]
        public double COFINS { get; set; }

    }
}