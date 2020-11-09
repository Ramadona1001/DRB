using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace VM
{
    public class LoginViewModel
    {
        public int Id { get; set; }
        [Required]
        public string Email { get; set; }
        public string Mobile { get; set; }
        public string MobileCode { get; set; }
        [Required]
        public string Password { get; set; }
        public int Sts { get; set; }
        public bool remember { get; set; }
        public string UserName { get; set; }
        public int UserRule { get; set; }
        public string AuthKey { get; set; }
        public bool activated { get; set; }
    }

    public class DropDownViewModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
    }
}
