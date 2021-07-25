using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyImport.WebApi.Dtos
{
    public class UserForLogInDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
    }
}
