using System;
using System.Collections.Generic;

namespace EF.Models
{
    public partial class MerchantBalanceLogTb
    {
        public long Id { get; set; }
        public long ClientIdFk { get; set; }
        public decimal Balance { get; set; }
        public byte? PaymentTypeIdFk { get; set; }
        public DateTime CreationDate { get; set; }
        public string PaymentId { get; set; }
        public long? OrderIdFk { get; set; }
        public string ReasonNote { get; set; }
        public byte TransactionTypeFk { get; set; }

        public virtual ClientTb ClientIdFkNavigation { get; set; }
        public virtual PaymentTypesTb PaymentTypeIdFkNavigation { get; set; }
        public virtual MerchantBalanceLogTypesTb TransactionTypeFkNavigation { get; set; }
    }
}
