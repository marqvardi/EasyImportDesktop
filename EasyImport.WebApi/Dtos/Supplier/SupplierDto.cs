using System.ComponentModel.DataAnnotations;

namespace EasyImport.WebApi.Dtos.Supplier
{
    public class SupplierDto
    {
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string CompanyName { get; set; }

        [Required]
        [StringLength(255)]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(255)]
        public string Contact { get; set; }
    }
}