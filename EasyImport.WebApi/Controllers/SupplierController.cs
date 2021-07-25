using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EasyImport.WebApi.Data;
using EasyImport.WebApi.Dtos.Supplier;
using EasyImport.WebApi.Helpers;
using EasyImport.WebApi.Models;
using EasyImport.WebApi.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EasyImport.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Policy = "RequireAdminRole")]
    [Authorize(Roles = "Admin, SimpleUser")]
    public class SupplierController : ControllerBase
    {
        private readonly IGenericRepository<Supplier> repository;
        private readonly IUnitOfWork unitOfWork;
        private readonly IMapper mapper;

        public SupplierController(IGenericRepository<Supplier> repository, IUnitOfWork unitOfWork, IMapper mapper)
        {
            this.repository = repository;
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<Pagination<Supplier>>> GetCategories([FromQuery] SupplierSpecParams supplierParams)
        {
            var spec = new SupplierSpecification(supplierParams);

            var countSpec = new SupplierWithFiltersForCountSpecification(supplierParams);

            var totalItems = await repository.CountAsync(countSpec);

            var suppliers = await repository.ListAsync(spec);

            var data = mapper.Map<IReadOnlyList<Supplier>, IReadOnlyList<SupplierToReturnDto>>(suppliers);

            return Ok(new Pagination<SupplierToReturnDto>(supplierParams.PageIndex, supplierParams.PageSize, totalItems, data));
        }

        [HttpPost]
        public async Task<ActionResult> CreateSupplier(Supplier supplier)
        {
            var existsInDB = CheckIfExists(supplier.CompanyName).Result;

            if (existsInDB) return BadRequest("Supplier name already exists");

            repository.Add(supplier);
            var category = await unitOfWork.Complete();

            if (category <= 0) return StatusCode(500, "Internal server error....");

            return CreatedAtAction("GetSupplierById", new { id = supplier.Id }, supplier);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Supplier>> GetSupplierById(int id)
        {
            var supplierFromRepo = await repository.GetByIdAsync(id);

            if (supplierFromRepo == null) return NotFound();

            return supplierFromRepo;
        }


        [HttpPut]
        public async Task<ActionResult<Category>> Put(SupplierDto supplierDto)
        {
            var supplierFromRepo = await repository.GetByIdAsync(supplierDto.Id);

            if (supplierFromRepo == null) return NotFound();

            mapper.Map(supplierDto, supplierFromRepo);

            repository.Update(supplierFromRepo);

            var result = await unitOfWork.Complete();

            var categoryToReturn = mapper.Map<SupplierDto>(supplierFromRepo);

            if (result >= 0)
                return Ok(categoryToReturn);

            return StatusCode(500, "Internal server error....");
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var supplierFromRepo = await repository.GetByIdAsync(id);

            if (supplierFromRepo == null) return NotFound();

            try
            {
                repository.Delete(supplierFromRepo);

                var result = await unitOfWork.Complete();

                if (result >= 0)
                    return Ok();
            }
            catch (System.Exception ex)
            {
                if (ex.InnerException.InnerException.Message.Contains("FK_Products_Suppliers_SupplierId"))
                {
                    return BadRequest("Can not delete, it has dependencies");
                }
                return BadRequest("Can not delete, something bad happened");
            }

            return StatusCode(500, "Internal server error....");
        }

        [HttpGet("exists")]
        public async Task<ActionResult<bool>> SupplierExists([FromQuery] string name)
        {
            var suppliers = await repository.ListAllAsync();

            var found = suppliers.FirstOrDefault(x => x.CompanyName.ToLower() == name.ToLower());

            if (found == null) return false;

            return true;
        }

        [HttpGet("supplierList")]
        public async Task<ActionResult<IReadOnlyList<SupplierDto>>> GetSupplierList()
        {
            var suppliers = await repository.ListAllAsync();

            if (suppliers == null) return BadRequest("List of suppliers not found");

            var suppliersToReturn = mapper.Map<IReadOnlyList<SupplierDto>>(suppliers);

            suppliersToReturn = suppliersToReturn.OrderBy(x => x.CompanyName).ToList();

            return Ok(suppliersToReturn);
        }

        private async Task<bool> CheckIfExists(string name)
        {
            var suppliers = await repository.ListAllAsync();

            var found = suppliers.FirstOrDefault(x => x.CompanyName.ToLower() == name.ToLower());

            if (found == null) return false;

            return true;
        }
    }
}