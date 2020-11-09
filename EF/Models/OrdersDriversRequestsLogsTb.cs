using System;
using System.Collections.Generic;

namespace EF.Models
{
    public partial class OrdersDriversRequestsLogsTb
    {
        public long Id { get; set; }
        public long OrderId { get; set; }
        public long DriverId { get; set; }
        public bool? Agreed { get; set; }
        public string Notes { get; set; }
        public DateTime? CreationDate { get; set; }

        public virtual OrdersTb Order { get; set; }
    }
}
