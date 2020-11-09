using System;
using System.Collections.Generic;

namespace EF.Models
{
    public partial class OrdersLogsTb
    {
        public long Id { get; set; }
        public long OrderIdFk { get; set; }
        public byte StatusIdFk { get; set; }
        public DateTime Date { get; set; }
        public string Note { get; set; }

        public virtual OrdersTb OrderIdFkNavigation { get; set; }
    }
}
