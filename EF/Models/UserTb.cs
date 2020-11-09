using System;
using System.Collections.Generic;

namespace EF.Models
{
    public partial class UserTb
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string EmailAddress { get; set; }
        public string Mobile { get; set; }
        public string Password { get; set; }
        public int? RuleId { get; set; }
        public bool? IsActive { get; set; }
        public string ConfirmCode { get; set; }
        public DateTime? CreationDate { get; set; }
        public bool IsDeleted { get; set; }

        public virtual UserRulesTb Rule { get; set; }
    }
}
