using System;
using System.Collections.Generic;

namespace EF.Models
{
    public partial class SystemProfitLogTb
    {
        public long Id { get; set; }
        public long OrderIdFk { get; set; }
        public decimal Balance { get; set; }
        public DateTime? CreationDate { get; set; }
        public string Note { get; set; }
    }
}
