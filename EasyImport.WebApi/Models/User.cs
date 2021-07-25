using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace EasyImport.WebApi.Models
{
    public class User : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ImageUrl { get; set; }
        public string PublicId { get; set; }

        public string RoleId { get; set; }

        public virtual Role Role { get; set; }
        public virtual ICollection<UserRole> UserRoles { get; set; }
    }
}