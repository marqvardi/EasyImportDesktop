using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EasyImport.WebApi.Data;
using EasyImport.WebApi.Dtos;
using EasyImport.WebApi.Helpers;
using EasyImport.WebApi.Models;
using EasyImport.WebApi.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using repos.EasyImport.Specifications;

namespace EasyImport.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Policy = "RequireAdminRole")]
    [Authorize(Roles = "Admin, SimpleUser")]
    public class CategoriesController : ControllerBase
    {
        private readonly IGenericRepository<Category> repository;
        private readonly IUnitOfWork unitOfWork;
        private readonly IMapper mapper;

        public CategoriesController(IGenericRepository<Category> repository, IUnitOfWork unitOfWork, IMapper mapper)
        {
            this.repository = repository;
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<Pagination<CategoryToReturnDto>>> GetCategories([FromQuery] CategorySpecParams categoryParams)
        {
            var spec = new CategorySpecification(categoryParams);

            var countSpec = new CategoryWithFiltersForCountSpecification(categoryParams);

            var totalItems = await repository.CountAsync(countSpec);

            var categories = await repository.ListAsync(spec);

            var data = mapper.Map<IReadOnlyList<Category>, IReadOnlyList<CategoryToReturnDto>>(categories);

            return Ok(new Pagination<CategoryToReturnDto>(categoryParams.PageIndex, categoryParams.PageSize, totalItems, data));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategoryById(int id)
        {
            var category = await repository.GetByIdAsync(id);

            if (category == null) return NotFound();

            return category;
        }

        [HttpPost]
        public async Task<ActionResult> CreateCategory(Category model)
        {
            var existsInDB = CheckIfExists(model.Name).Result;

            if (existsInDB) return BadRequest("Category already exists");

            repository.Add(model);
            var category = await unitOfWork.Complete();

            if (category <= 0) return StatusCode(500, "Internal server error....");

            return CreatedAtAction("GetCategoryById", new { id = model.Id }, model);
        }

        [HttpPut]
        public async Task<ActionResult<Category>> Put(CategoryDto categoryDto)
        {
            var categoryFromRepo = await repository.GetByIdAsync(categoryDto.Id);

            if (categoryFromRepo == null) return NotFound();

            mapper.Map(categoryDto, categoryFromRepo);

            repository.Update(categoryFromRepo);

            var result = await unitOfWork.Complete();

            var categoryToReturn = mapper.Map<CategoryDto>(categoryFromRepo);

            if (result >= 0)
                return Ok(categoryToReturn);

            return StatusCode(500, "Internal server error....");
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var categoryFromRepo = await repository.GetByIdAsync(id);

            if (categoryFromRepo == null) return NotFound();

            try
            {
                repository.Delete(categoryFromRepo);

                var result = await unitOfWork.Complete();

                if (result >= 0)
                    return Ok();
            }
            catch (System.Exception ex)
            {
                if (ex.InnerException.InnerException.Message.Contains("FK_Products_Categories_CategoryId"))
                {
                    return BadRequest("Can not delete, it has dependencies");
                }
                return BadRequest("Can not delete, something bad happened");
            }

            return StatusCode(500, "Internal server error....");
        }

        [HttpGet("categoriesList")]
        public async Task<ActionResult<IReadOnlyList<Category>>> GetCategoriesList()
        {
            var categories = await repository.ListAllAsync();
            if (categories == null) return BadRequest("Categories doesnt exist");

            categories = categories.OrderBy(x => x.Name).ToList();

            return Ok(categories);
        }

        [HttpGet("exists")]
        public async Task<ActionResult<bool>> CategoryExists([FromQuery] string name)
        {
            var categories = await repository.ListAllAsync();

            var found = categories.FirstOrDefault(x => x.Name.ToLower() == name.ToLower());

            if (found == null) return false;

            return true;
        }

        private async Task<bool> CheckIfExists(string name)
        {
            var categories = await repository.ListAllAsync();

            var found = categories.FirstOrDefault(x => x.Name.ToLower() == name.ToLower());

            if (found == null) return false;

            return true;
        }
    }
}
