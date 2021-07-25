using System.Collections.Generic;
using System.Linq;
using EasyImport.WebApi.Models;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;

namespace EasyImport.WebApi.Data
{
    public class Seed
    {
        public static void SeedStatus(DataContext context)
        {
            if (!context.OrderStatus.Any())
            {
                var statusList = new List<OrderStatus>
                {
                    new OrderStatus{ Status = "In production"},
                    new OrderStatus{ Status = "On the sea"},
                    new OrderStatus{ Status = "At port"},
                    new OrderStatus{ Status = "Completed"},
                };

                foreach (var status in statusList)
                {
                    context.OrderStatus.Add(status);
                }
                context.SaveChanges();
            }
        }

        public static void SeedRoles(RoleManager<Role> roleManager)
        {
            if (!roleManager.Roles.Any())
            {
                var roles = new List<Role>
                {
                    new Role{Name = "Admin"},
                    new Role{Name = "SimpleUser"},
                    // new Role{Name = "Exporter"},
                    // new Role{Name = "Supplier"},
                };

                var roleIdForAdmin = "";
                foreach (var role in roles)
                {
                    if (role.Name == "Admin")
                    {
                        roleIdForAdmin = role.Name;
                    }
                    roleManager.CreateAsync(role).Wait();
                }
            }
        }
        public static void SeedUsers(UserManager<User> uSerManager, RoleManager<Role> roleManager)
        {
            if (!uSerManager.Users.Any())
            {
                var roleId = roleManager.FindByNameAsync("Admin").Result;
                //create admin
                var adminUser = new User
                {
                    UserName = "Admin",
                    Email = "Admin@admin.com",
                    FirstName = "Marcus",
                    LastName = "Vardi",
                    RoleId = roleId.Id
                };

                var result = uSerManager.CreateAsync(adminUser, "password").Result;

                if (result.Succeeded)
                {
                    var admin = uSerManager.FindByNameAsync("Admin").Result;
                    //uSerManager.AddToRoleAsync(admin, "Admin");
                    //uSerManager.AddToRoleAsync(admin, "SoMarcas");
                    uSerManager.AddToRolesAsync(admin, new[] { "Admin" }).Wait();
                }
            }
        }

    }
}