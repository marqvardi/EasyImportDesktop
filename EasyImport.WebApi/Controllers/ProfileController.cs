using EasyImport.WebApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace EasyImport.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Policy = "RequireAdminRole")]
    [Authorize(Roles = "Admin, SimpleUser")]
    public class ProfileController : ControllerBase
    {
        private readonly UserManager<User> userManager;
        public ProfileController(UserManager<User> userManager)
        {
            this.userManager = userManager;
        }


    }
}