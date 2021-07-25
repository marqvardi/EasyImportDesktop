using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace EasyImport.WebApi.Models
{
    public class Role : IdentityRole<string>
    {
        public virtual ICollection<UserRole> UserRoles { get; set; }
    }
}