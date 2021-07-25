namespace EasyImport.WebApi.Dtos.User
{
    public class UserChangePassword
    {
            public string Id { get; set; }
      
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }  
    }
}