using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EasyImport.WebApi.Data;
using EasyImport.WebApi.Dtos.Product;
using EasyImport.WebApi.Helpers;
using EasyImport.WebApi.Models;
using EasyImport.WebApi.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EasyImport.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Policy = "RequireAdminRole")]
    [Authorize(Roles = "Admin, SimpleUser")]
    public class ProductController : ControllerBase
    {
        private readonly IGenericRepository<Product> repository;
        private readonly IUnitOfWork unitOfWork;
        private readonly IMapper mapper;
        private readonly IWebHostEnvironment host;

        public ProductController(IGenericRepository<Product> repository, IUnitOfWork unitOfWork, IMapper mapper, IWebHostEnvironment host)
        {
            this.host = host;
            this.repository = repository;
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<Pagination<ProductToReturnDto>>> GetProducts([FromQuery] ProductSpecParams productParams)
        {
            var spec = new ProductSpecification(productParams);

            var countSpec = new ProductWithFiltersForCountSpecification(productParams);

            var totalItems = await repository.CountAsync(countSpec);

            var products = await repository.ListAsync(spec);

            var data = mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>(products);

            return Ok(new Pagination<ProductToReturnDto>(productParams.PageIndex, productParams.PageSize, totalItems, data));
        }


        [HttpGet("noparams")]
        public async Task<ActionResult<ProductToReturnDto>> GetProductsNoParams()
        {
            var spec = new ProductSpecification();

            // var countSpec = new ProductWithFiltersForCountSpecification(productParams);

            // var totalItems = await repository.CountAsync(countSpec);

            var products = await repository.ListAsync(spec);

            var data = mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>(products);

            return Ok(data);
        }


        [HttpPost]
        public async Task<ActionResult> CreateProduct(ProductCreateDto model)
        {
            var existsInDB = CheckIfExists(model.ProductCode).Result;

            if (existsInDB) return BadRequest("Product already exists");

            var addProductToDb = mapper.Map<Product>(model);

            if (addProductToDb == null) return BadRequest("Something wrong with the information given");

            repository.Add(addProductToDb);

            var product = await unitOfWork.Complete();

            if (product <= 0) return StatusCode(500, "Internal server error....");

            return CreatedAtAction("GetProductById", new { id = addProductToDb.Id }, model);
        }

        [HttpGet("GetProductListForOrder")]
        public async Task<ActionResult<IReadOnlyList<ProductListForOrder>>> GetProductListForOrder()
        {
            var productsFromRepo = await repository.ListAllAsync();

            var productsToReturn = mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductListForOrder>>(productsFromRepo);

            return Ok(productsToReturn);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductToReturnDto>> GetProductById(int id)
        {
            var spec = new ProductWithAllIncludes();

            var list = await repository.ListAsync(spec);

            var productFound = list.Where(x => x.Id == id).FirstOrDefault();

            if (productFound == null) return NotFound();

            var productToReturn = mapper.Map<ProductToReturnDto>(productFound);

            return productToReturn;
        }

        [HttpPut]
        public async Task<ActionResult<ProductToReturnDto>> Put(ProductCreateDto productCreateDto)
        {
            var spec = new ProductWithAllIncludes();

            var list = await repository.ListAsync(spec);

            var productFound = list.Where(x => x.Id == productCreateDto.Id).FirstOrDefault();

            if (productFound == null) return NotFound();

            mapper.Map(productCreateDto, productFound);

            repository.Update(productFound);

            var result = await unitOfWork.Complete();

            var productToReturn = mapper.Map<ProductToReturnDto>(productFound);

            if (result >= 0)
                return Ok(productToReturn);

            return StatusCode(500, "Internal server error....");
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var productFromRepo = await repository.GetByIdAsync(id);

            if (productFromRepo == null) return NotFound();

            repository.Delete(productFromRepo);

            var result = await unitOfWork.Complete();

            if (result >= 0)
                return Ok();

            return StatusCode(500, "Internal server error....");
        }

        [HttpGet("exists")]
        public async Task<ActionResult<bool>> ProductExists([FromQuery] string name)
        {
            var products = await repository.ListAllAsync();

            var found = products.FirstOrDefault(x => x.ProductCode.ToLower() == name.ToLower());

            if (found == null) return false;

            return true;
        }

        private async Task<bool> CheckIfExists(string name)
        {
            var product = await repository.ListAllAsync();

            var found = product.FirstOrDefault(x => x.ProductCode.ToLower() == name.ToLower());

            if (found == null) return false;

            return true;
        }

    }
}