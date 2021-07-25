using System.ComponentModel.DataAnnotations;

namespace EasyImport.WebApi.Models
{
    public class Product
    {
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string ProductCode { get; set; }

        [Required]
        [StringLength(255)]
        public string Description { get; set; }

        //[Required]
        public string Image { get; set; }

        public string PublicId { get; set; }

        public bool Active { get; set; }
        public double CartonWidth { get; set; }
        public double CartonHeight { get; set; }
        public double CartonDeepness { get; set; }
        public double NetKgs { get; set; }
        public double GrossKgs { get; set; }
        public decimal Price { get; set; }
        public int QtyPerCarton { get; set; }

        [Required]
        public int SupplierId { get; set; }

        [Required]
        public int NcmId { get; set; }

        [Required]
        public int CategoryId { get; set; }

        public virtual Supplier Supplier { get; set; }
        public virtual Category Category { get; set; }
        public virtual NCM Ncm { get; set; }
    }
}