namespace EasyImport.WebApi.Dtos.User
{
    public class UserToReturnDto
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string ImageUrl { get; set; }
        public string RoleId { get; set; }
        public string RoleName { get; set; }
    }
}