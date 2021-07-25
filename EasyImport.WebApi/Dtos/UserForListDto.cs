using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyImport.WebApi.Dtos
{
    public class UserForListDto
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string ImageUrl { get; set; }
        public string RoleId { get; set; }
    }
}
