using System;
using System.Collections.Generic;

namespace EF.Models
{
    public partial class OrerItemsTb
    {
        public long Id { get; set; }
        public byte PackageTypeIdFk { get; set; }
        public int CatIdFk { get; set; }

        public virtual CategoryTb CatIdFkNavigation { get; set; }
        public virtual PackageTypesTb PackageTypeIdFkNavigation { get; set; }
    }
}
