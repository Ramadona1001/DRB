using System;
using System.Collections.Generic;

namespace EF.Models
{
    public partial class UserRulesTb
    {
        public UserRulesTb()
        {
            UserTb = new HashSet<UserTb>();
        }

        public int Id { get; set; }
        public string RuleName { get; set; }

        public virtual ICollection<UserTb> UserTb { get; set; }
    }
}
