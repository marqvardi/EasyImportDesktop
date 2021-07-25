using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using EasyImport.WebApi.Data;
using EasyImport.WebApi.Dtos;
using EasyImport.WebApi.Helpers;
using EasyImport.WebApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace EasyImport.WebApi.Controllers
{
    // [Route("api/product/{userId}/{productId}/[controller]")]
    [ApiController]
    //[Authorize(Policy = "RequireAdminRole")]
    [Authorize(Roles = "Admin, SimpleUser")]
    public class PhotosController : ControllerBase
    {
        private readonly IOptions<CloudinarySettings> cloudinaryConfig;
        private readonly IMapper mapper;
        private readonly IGenericRepository<Photo> repository;
        private Cloudinary cloudinary;
        private readonly UserManager<User> userManager;
        private readonly IUnitOfWork unitOfWork;
        private readonly IGenericRepository<Product> repositoryProduct;
        public PhotosController(IUnitOfWork unitOfWork, UserManager<User> userManager, IGenericRepository<Product> repositoryProduct, IGenericRepository<Photo> repository, IMapper mapper, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            this.repositoryProduct = repositoryProduct;
            this.unitOfWork = unitOfWork;
            this.userManager = userManager;
            this.repository = repository;
            this.mapper = mapper;
            this.cloudinaryConfig = cloudinaryConfig;

            Account acc = new Account(
                cloudinaryConfig.Value.CloudName,
                cloudinaryConfig.Value.ApiKey,
                cloudinaryConfig.Value.ApiSecret
            );

            cloudinary = new Cloudinary(acc);
        }



        [HttpPost("api/product/{userId}/{productId}/[controller]")]
        public async Task<IActionResult> AddPhoto(string userId, int productId, [FromForm] PhotoForCreationDto photoForCreationDto)
        {
            if (userId != User.FindFirst(ClaimTypes.NameIdentifier).Value) return Unauthorized();

            var user = await userManager.FindByIdAsync(userId);

            var productFromRepo = await repositoryProduct.GetByIdAsync(productId);
            if (productFromRepo == null) return BadRequest("Product not found");

            var photoUploaded = new PhotoForCreationDto();

            if (productFromRepo.PublicId == null)
            {
                // Create the new image
                photoUploaded = UploadPicture(photoForCreationDto, productFromRepo);
            }
            else
            {
                //Delete old image
                // It will useful when deleting a product, so we can delete Photo from the cloud        

                // var deleteParams = new DeletionParams(productFromRepo.PublicId);
                // var result = cloudinary.Destroy(deleteParams);

                photoUploaded = UploadPicture(photoForCreationDto, productFromRepo);

                // if (result.Result == "ok")
                // {
                //     // repository.Delete(photoFromRepo);
                //     // Here I can delete the photo from my db if needed.
                //     //photo deleted on cloudinary, do I really need the photo class?
                // }
            }

            var photo = mapper.Map<Photo>(photoUploaded);
            // repository.Add(photo);

            var saved = await unitOfWork.Complete();

            if (saved >= 0)
            {
                var photoToReturnDto = mapper.Map<PhotoToReturnDto>(photo);
                return CreatedAtRoute("GetPhoto",
                                    new { userId = userId, id = photo.Id, productId = productId }, photoToReturnDto);
            }

            return StatusCode(500, "Internal server error....");
        }

        [HttpPost("api/user/{userId}/[controller]")]
        public async Task<IActionResult> AddPhotoForUser(string userId, [FromForm] PhotoForCreationDto photoForCreationDto)
        {
            if (userId != User.FindFirst(ClaimTypes.NameIdentifier).Value) return Unauthorized();

            var user = await userManager.FindByIdAsync(userId);

            if (user == null) return BadRequest("User not found");

            var photoUploaded = new PhotoForCreationDto();

            if (user.PublicId == null)
            {
                // Create the new image
                photoUploaded = UploadPictureForUser(photoForCreationDto, user);
            }
            else
            {
                //Delete old image
                //var photoToDelete = productFromRepo.Image;               

                var deleteParams = new DeletionParams(user.PublicId);
                var result = cloudinary.Destroy(deleteParams);
                photoUploaded = UploadPictureForUser(photoForCreationDto, user);


                if (result.Result == "ok")
                {
                    // repository.Delete(photoFromRepo);
                    // Here I can delete the photo from my db if needed.
                    //photo deleted on cloudinary, do I really need the photo class?
                }
            }

            var photo = mapper.Map<Photo>(photoUploaded);
            var saved = await unitOfWork.Complete();

            if (saved >= 0)
            {
                var photoToReturnDto = mapper.Map<PhotoToReturnDto>(photo);
                return CreatedAtRoute("GetPhoto",
                                    new { userId = userId, id = photo.Id }, photoToReturnDto);
            }

            return StatusCode(500, "Internal server error....");
        }

        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo = await repository.GetByIdAsync(id);

            var photo = mapper.Map<PhotoToReturnDto>(photoFromRepo);

            return Ok(photo);
        }

        private PhotoForCreationDto UploadPictureForUser(PhotoForCreationDto photoForCreationDto, User user)
        {
            var file = photoForCreationDto.File;

            var uploadResult = new ImageUploadResult();

            // if (file.Length <= 0) return BadRequest("No file found");

            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500)
                    };
                    uploadResult = cloudinary.Upload(uploadParams);
                }
            }
            photoForCreationDto.Url = uploadResult.Url.ToString();
            photoForCreationDto.PublicId = uploadResult.PublicId;
            user.ImageUrl = uploadResult.Url.ToString();
            user.PublicId = uploadResult.PublicId;

            return photoForCreationDto;
        }








        private PhotoForCreationDto UploadPicture(PhotoForCreationDto photoForCreationDto, Product productFromRepo)
        {
            var file = photoForCreationDto.File;

            var uploadResult = new ImageUploadResult();

            // if (file.Length <= 0) return BadRequest("No file found");

            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("limit")
                    };
                    uploadResult = cloudinary.Upload(uploadParams);
                }
            }
            photoForCreationDto.Url = uploadResult.Url.ToString();
            photoForCreationDto.PublicId = uploadResult.PublicId;
            productFromRepo.Image = uploadResult.Url.ToString();
            productFromRepo.PublicId = uploadResult.PublicId;

            return photoForCreationDto;
        }


    }
}