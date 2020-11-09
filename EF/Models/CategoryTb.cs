using System;
using System.Collections.Generic;

namespace EF.Models
{
    public partial class CategoryTb
    {
        public CategoryTb()
        {
            OrdersItemsTb = new HashSet<OrdersItemsTb>();
        }

        public int Id { get; set; }
        public string NameAr { get; set; }
        public string NameEn { get; set; }
        public bool? IsActive { get; set; }

        public virtual ICollection<OrdersItemsTb> OrdersItemsTb { get; set; }
    }
}
