using System;
using System.Collections.Generic;

namespace EF.Models
{
    public partial class PaymentTypesTb
    {
        public PaymentTypesTb()
        {
            MerchantBalanceLogTb = new HashSet<MerchantBalanceLogTb>();
            OrdersTb = new HashSet<OrdersTb>();
        }

        public byte Id { get; set; }
        public string NameAr { get; set; }
        public string NameEn { get; set; }
        public string Image { get; set; }

        public virtual ICollection<MerchantBalanceLogTb> MerchantBalanceLogTb { get; set; }
        public virtual ICollection<OrdersTb> OrdersTb { get; set; }
    }
}
