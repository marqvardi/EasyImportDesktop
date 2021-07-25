using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using EasyImport.WebApi.Data;
using EasyImport.WebApi.Dtos;
using EasyImport.WebApi.Dtos.User;
using EasyImport.WebApi.Helpers;
using EasyImport.WebApi.Models;
using EasyImport.WebApi.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace EasyImport.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin, SimpleUser")]

    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly DataContext context;
        private readonly IUnitOfWork unitOfWork;
        private readonly IGenericRepository<User> repoUser;
        private readonly IPasswordHasher<User> _passwordHasher;

        public AuthController(IPasswordHasher<User> _passwordHasher, IGenericRepository<User> repoUser, IUnitOfWork unitOfWork, DataContext context, IConfiguration config, IMapper mapper, UserManager<User> userManager, SignInManager<User> signInManager)
        {
            this._passwordHasher = _passwordHasher;
            this.repoUser = repoUser;
            this.unitOfWork = unitOfWork;
            this.context = context;
            this._config = config;
            this._mapper = mapper;
            this._userManager = userManager;
            this._signInManager = signInManager;
        }

        [HttpGet]
        public async Task<ActionResult<Pagination<UserToReturnDto>>> GetUsers([FromQuery] UserSpecParams userParams)
        {
            var spec = new UserSpecification(userParams);

            var countSpec = new UserWithFiltersForCountSpecification(userParams);

            var totalItems = await repoUser.CountAsync(countSpec);

            var users = await repoUser.ListAsync(spec);

            var data = _mapper.Map<IReadOnlyList<User>, IReadOnlyList<UserToReturnDto>>(users);

            return Ok(new Pagination<UserToReturnDto>(userParams.PageIndex, userParams.PageSize, totalItems, data));
        }

        [HttpPost("userEditProfile")]
        public async Task<ActionResult> userEditProfile(UserToEditDto userToEditDto)
        {
            var userFromRepo = await _userManager.FindByIdAsync(userToEditDto.Id);

            _mapper.Map(userToEditDto, userFromRepo);

            await _userManager.UpdateAsync(userFromRepo);

            return Ok(userFromRepo);
        }

        [HttpPost("changePassword")]
        public async Task<ActionResult> ChangePassword(UserChangePassword userChangePassword)
        {
            var userFromRepo = await _userManager.FindByIdAsync(userChangePassword.Id);
            if (userFromRepo == null) return NotFound();

            var result = await _userManager.ChangePasswordAsync
                            (userFromRepo, userChangePassword.OldPassword, userChangePassword.NewPassword);

            if (result.Succeeded)
                return Ok();

            return BadRequest("Something went wrong");
        }

        // [AllowAnonymous]
        [HttpPost("Register")]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {
            var user = await _userManager.FindByEmailAsync(userForRegisterDto.Email);

            if (user != null) return BadRequest("User already exists");

            var userToCreate = _mapper.Map<User>(userForRegisterDto);

            var role = GetRolebyId(userForRegisterDto.RoleId);
            userToCreate.RoleId = role.Id;

            var result = await _userManager.CreateAsync(userToCreate, userForRegisterDto.Password);

            var userRole = new UserRole();
            userRole.UserId = userToCreate.Id;
            userRole.RoleId = role.Id;

            context.UserRoles.Add(userRole);
            var completed = await unitOfWork.Complete();

            var userToReturn = _mapper.Map<UserDetailsToReturnDto>(userToCreate);

            if (result.Succeeded && completed > 0)
            {
                return Created("login", userToReturn);
                //return CreatedAtRoute("GetUser", new { Controller = "Users", id = userToCreate.Id }, userToReturn);
            }
            return BadRequest(result.Errors);
        }

        [HttpPut]
        public async Task<ActionResult<UserToReturnDto>> EditUser(UserToReturnDto user)
        {
            if (string.IsNullOrEmpty(user.Email) && string.IsNullOrEmpty(user.Password))
                return BadRequest("Empty fields");

            var userFromRepo = await _userManager.FindByIdAsync(user.Id);

            if (userFromRepo == null) return NotFound();

            _mapper.Map(user, userFromRepo);

            var role = GetRolebyId(user.RoleId);
            userFromRepo.RoleId = role.Id;
            userFromRepo.Role.Name = role.Name;

            var hashedPassword = _passwordHasher.HashPassword(userFromRepo, user.Password);
            userFromRepo.PasswordHash = hashedPassword;

            await _userManager.UpdateAsync(userFromRepo);

            var result = await unitOfWork.Complete();

            var userToReturn = _mapper.Map<UserToReturnDto>(userFromRepo);

            if (result >= 0) return Ok();
            // if (result >= 0) return RedirectToAction("GetUserById", new { id = userToReturn.Id });

            return StatusCode(500, "Internal server error....");
        }


        [HttpGet("GetUserById/{id}")]
        public async Task<ActionResult<UserToReturnDto>> GetUSerById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user == null) return NotFound();

            var role = await context.Roles.FirstAsync(x => x.Id == user.RoleId);

            var userToReturn = _mapper.Map<UserToReturnDto>(user);
            userToReturn.RoleName = role.Name;

            return Ok(userToReturn);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(string id)
        {
            var userFromRepo = await _userManager.FindByIdAsync(id);

            if (userFromRepo == null) return NotFound("User not found");

            context.Remove(userFromRepo);
            var result = await unitOfWork.Complete();

            if (result >= 0)
                return Ok();

            return StatusCode(500, "Internal server error....");
        }


        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> LogIn(UserForLogInDto userLogInDto)
        {
            var user = await _userManager.FindByEmailAsync(userLogInDto.Email);

            if (user == null) return NotFound();

            var result = await _signInManager.CheckPasswordSignInAsync(user, userLogInDto.Password, false);

            if (result.Succeeded)
            {
                var appUser = _mapper.Map<UserForListDto>(user);

                return Ok(new
                {
                    token = GenerateJwtToken(user).Result,
                    user = appUser
                });
            }

            return Unauthorized();
        }


        private async Task<string> GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
           {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName)
            };

            var roles = await _userManager.GetRolesAsync(user);

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(30),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        private async Task<List<Role>> GetRoles()
        {
            var roleNames = await context.Roles.ToListAsync();
            return roleNames;
        }

        private Role GetRolebyId(string id)
        {
            var role = context.Roles.FindAsync(id).Result;
            return role;
        }
    }
}