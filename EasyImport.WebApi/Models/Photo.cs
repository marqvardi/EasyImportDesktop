using System.ComponentModel.DataAnnotations;

namespace EasyImport.WebApi.Models
{
    public class Photo
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public string PublicId { get; set; }


    }
}