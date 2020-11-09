using System;
using System.Collections.Generic;

namespace EF.Models
{
    public partial class MerchantBalanceLogTypesTb
    {
        public MerchantBalanceLogTypesTb()
        {
            MerchantBalanceLogTb = new HashSet<MerchantBalanceLogTb>();
        }

        public byte Id { get; set; }
        public string NameAr { get; set; }
        public string NameEn { get; set; }
        public string Color { get; set; }

        public virtual ICollection<MerchantBalanceLogTb> MerchantBalanceLogTb { get; set; }
    }
}
