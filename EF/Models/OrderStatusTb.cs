using System;
using System.Collections.Generic;

namespace EF.Models
{
    public partial class OrderStatusTb
    {
        public OrderStatusTb()
        {
            OrdersTb = new HashSet<OrdersTb>();
        }

        public byte Id { get; set; }
        public string NameAr { get; set; }
        public string NameEn { get; set; }
        public string Color { get; set; }
        public string Icon { get; set; }
        public double Percentage { get; set; }
        public bool? IsActive { get; set; }

        public virtual ICollection<OrdersTb> OrdersTb { get; set; }
    }
}
