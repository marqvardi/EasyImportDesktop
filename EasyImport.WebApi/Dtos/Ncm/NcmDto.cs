using System.ComponentModel.DataAnnotations;

namespace EasyImport.WebApi.Dtos.Ncm
{
    public class NcmDto
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
        public double? PIS { get; set; }

        [Required]
        [Range(0, 1)]
        public double COFINS { get; set; }

        [Range(0, 1)]
        public double? ICMS { get; set; }
    }
}