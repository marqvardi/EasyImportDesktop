using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EasyImport.WebApi.Data;
using EasyImport.WebApi.Dtos;
using EasyImport.WebApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EasyImport.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Policy = "RequireAdminRole")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly DataContext context;
        private readonly UserManager<User> userManager;
        private readonly RoleManager<Role> roleManager;

        public AdminController(DataContext context, UserManager<User> userManager, RoleManager<Role> roleManager)
        {
            this.roleManager = roleManager;
            this.context = context;
            this.userManager = userManager;
        }

        //Mudar pra Admin
        //[AllowAnonymous]
        [HttpGet("getRoleNames")]
        public async Task<List<Role>> GetRoleNames()
        {
            var roleNames = await context.Roles.ToListAsync();
            return roleNames;
        }

        //[Authorize(Policy = "RequireAdminRole")]
        [HttpGet("usersWithRoles")]
        public async Task<IActionResult> GetUsersWithRoles()
        {
            var userList = await context.Users
                        .OrderBy(x => x.UserName)
                        .Select(user => new
                        {
                            Id = user.Id,
                            UserName = user.UserName,
                            Roles = (from userRole in user.UserRoles
                                     join role in context.Roles
                                         on userRole.RoleId equals role.Id
                                     select role.Name).ToList()
                        }).ToListAsync();

            return Ok(userList);
        }

        // [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("editRoles/{userName}")]
        public async Task<IActionResult> EditRoles(string userName, RoleEditDto RoleEditDto)
        {
            var user = await userManager.FindByNameAsync(userName);

            var userRoles = await userManager.GetRolesAsync(user);
            var selectedRoles = RoleEditDto.RoleNames;

            // Below is the same as --> selected = selectedRoles != null ? selectedRoles : new string[] {};
            selectedRoles = selectedRoles ?? new string[] { };
            var result = await userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

            if (!result.Succeeded)
                return BadRequest("Failed to add to roles");

            result = await userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

            if (!result.Succeeded)
                return BadRequest("Failed to remove the roles");

            return Ok(await userManager.GetRolesAsync(user));
        }

        // [Authorize(Policy = "RequireSoMarcasRole")]
        [HttpGet("soMarcas")]
        public IActionResult GetSoMarcas()
        {
            return Ok("Only So marcas can see this");
        }
    }
}