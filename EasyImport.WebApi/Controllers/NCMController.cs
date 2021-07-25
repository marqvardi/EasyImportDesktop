using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EasyImport.WebApi.Data;
using EasyImport.WebApi.Dtos.Ncm;
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
    public class NCMController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly IUnitOfWork unitOfWork;
        private readonly IGenericRepository<NCM> repository;
        public NCMController(IGenericRepository<NCM> repository, IUnitOfWork unitOfWork, IMapper mapper)
        {
            this.repository = repository;
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<NCM>> GetNcmById(int id)
        {
            var ncm = await repository.GetByIdAsync(id);

            if (ncm == null) return NotFound();

            return ncm;
        }

        [HttpPost]
        public async Task<ActionResult> CreateNCM(NCM model)
        {
            var existsInDB = CheckIfExists(model.NcmCode).Result;

            if (existsInDB) return BadRequest("Ncm Already Exists");

            repository.Add(model);
            var ncm = await unitOfWork.Complete();

            if (ncm <= 0) return StatusCode(500, "Internal server error....");

            return CreatedAtAction("GetNcmById", new { id = model.Id }, model);
        }

        [HttpGet]
        public async Task<ActionResult<Pagination<NCM>>> GetNcms([FromQuery] NcmSpecParams ncmParams)
        {
            var spec = new NcmSpecification(ncmParams);

            var countSpec = new NcmWithFiltersForCountSpecification(ncmParams);

            var totalItems = await repository.CountAsync(countSpec);

            var categories = await repository.ListAsync(spec);

            return Ok(new Pagination<NCM>(ncmParams.PageIndex, ncmParams.PageSize, totalItems, categories));
        }


        [HttpPut]
        public async Task<ActionResult<NCM>> Put(NcmDto ncmDto)
        {
            var ncmFromRepo = await repository.GetByIdAsync(ncmDto.Id);

            if (ncmFromRepo == null) return NotFound();

            mapper.Map(ncmDto, ncmFromRepo);

            repository.Update(ncmFromRepo);

            var result = await unitOfWork.Complete();

            var ncmToReturn = mapper.Map<NcmDto>(ncmFromRepo);

            if (result >= 0)
                return Ok(ncmToReturn);

            return StatusCode(500, "Internal server error....");
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var ncmFromRepo = await repository.GetByIdAsync(id);

            if (ncmFromRepo == null) return NotFound();

            try
            {
                repository.Delete(ncmFromRepo);

                var result = await unitOfWork.Complete();

                if (result >= 0)
                    return Ok();

            }
            catch (System.Exception ex)
            {
                if (ex.InnerException.InnerException.Message.Contains("FK_Products_NCMs_NcmId"))
                {
                    return BadRequest("Can not delete, it has dependencies");
                }
                return BadRequest("Can not delete, something bad happened");
            }
            return StatusCode(500, "Internal server error....");

        }

        [HttpGet("exists")]
        public async Task<ActionResult<bool>> NcmExists([FromQuery] string name)
        {
            var ncms = await repository.ListAllAsync();

            var found = ncms.FirstOrDefault(x => x.NcmCode.ToLower() == name.ToLower());

            if (found == null) return false;

            return true;
        }

        [HttpGet("ncmList")]
        public async Task<ActionResult<IReadOnlyList<NCM>>> GetNcmList()
        {
            var ncms = await repository.ListAllAsync();
            if (ncms == null) return BadRequest("NCM list not found");

            var ncmListToReturn = mapper.Map<IReadOnlyList<NcmDto>>(ncms);
            ncmListToReturn = ncmListToReturn.OrderBy(x => x.NcmCode).ToList();

            return Ok(ncmListToReturn);
        }

        private async Task<bool> CheckIfExists(string name)
        {
            var ncms = await repository.ListAllAsync();

            var found = ncms.FirstOrDefault(x => x.NcmCode.ToLower() == name.ToLower());

            if (found == null) return false;

            return true;
        }
    }
}