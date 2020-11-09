using System;
using System.Collections.Generic;

namespace EF.Models
{
    public partial class PackageTypesTb
    {
        public PackageTypesTb()
        {
            OrdersItemsTb = new HashSet<OrdersItemsTb>();
        }

        public byte Id { get; set; }
        public string NameAr { get; set; }
        public string NameEn { get; set; }

        public virtual ICollection<OrdersItemsTb> OrdersItemsTb { get; set; }
    }
}
