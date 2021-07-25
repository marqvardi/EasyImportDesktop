using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace EasyImport.WebApi.Models
{
    public class Category  
    {
        public int Id { get; set; }

        [Required]
        [StringLength(255)]      
        public string Name { get; set; }
    }
}
