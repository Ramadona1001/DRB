using System;
using System.Collections.Generic;

namespace EF.Models
{
    public partial class DriversProfitLogTb
    {
        public long Id { get; set; }
        public long OrderIdFk { get; set; }
        public long DriverIdFk { get; set; }
        public decimal Balance { get; set; }
        public DateTime? CreationDate { get; set; }

        public virtual OrdersTb OrderIdFkNavigation { get; set; }
    }
}
