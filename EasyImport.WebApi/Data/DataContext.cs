using EasyImport.WebApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyImport.WebApi.Data
{
    public class DataContext : IdentityDbContext<User, Role, string, IdentityUserClaim<string>, UserRole,
                               IdentityUserLogin<string>, IdentityRoleClaim<string>, IdentityUserToken<string>>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<NCM> NCMs { get; set; }

        public DbSet<Supplier> Suppliers { get; set; }

        public DbSet<Product> Products { get; set; }

        public DbSet<Photo> Photos { get; set; }

        public DbSet<OrderItem> OrderItem { get; set; }
        public DbSet<Order> Order { get; set; }
        public DbSet<OrderStatus> OrderStatus { get; set; }
        //public DbSet<OrderDetails> OrderDetails { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);



            // builder.Entity<Order>()
            //   .HasOne(n => n.OrderStatus)
            //   .WithOne()
            //   .HasForeignKey(n => n.Id)
            //   .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<OrderItem>()
                    .Property(p => p.Price)
                    .HasColumnType("decimal(9,4)");

            builder.Entity<OrderItem>()
                .HasOne(n => n.Supplier)
                .WithMany()
                .HasForeignKey(n => n.SupplierId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<OrderItem>()
                .HasOne(n => n.Product)
                .WithMany()
                .HasForeignKey(n => n.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            // builder.Entity<OrderItem>()
            //     .HasOne(n => n.OrderDetails)
            //     .WithMany()
            //     .HasForeignKey(n => n.OrderDetailsId)
            //     .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Product>()
                .HasOne(n => n.Ncm)
                .WithMany()
                .HasForeignKey(n => n.NcmId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Product>()
                .HasOne(n => n.Category)
                .WithMany()
                .HasForeignKey(c => c.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Product>()
                .HasOne(n => n.Supplier)
                .WithMany()
                .HasForeignKey(s => s.SupplierId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Product>()
                .HasIndex(x => x.ProductCode)
                .IsUnique();

            builder.Entity<Product>()
                    .Property(p => p.Price)
                    .HasColumnType("decimal(9,4)");

            builder.Entity<Supplier>()
                .HasIndex(x => x.CompanyName)
                .IsUnique();

            builder.Entity<NCM>()
                .HasIndex(x => x.NcmCode)
                .IsUnique();

            builder.Entity<Category>()
                .HasIndex(x => x.Name)
                .IsUnique();

            builder.Entity<UserRole>(userRole =>
            {
                userRole.HasKey(ur => new { ur.UserId, ur.RoleId });

                userRole.HasOne(ur => ur.Role)
                                .WithMany(r => r.UserRoles)
                                .HasForeignKey(ur => ur.RoleId)
                                .IsRequired();

                userRole.HasOne(ur => ur.User)
                               .WithMany(r => r.UserRoles)
                               .HasForeignKey(ur => ur.UserId)
                               .IsRequired();
            });


            builder.Entity<Role>()
                      .Property(e => e.Id)
                      .ValueGeneratedOnAdd();

            // builder.Entity<Category>().HasIndex(u => u.Name).IsUnique();
        }
    }
}
