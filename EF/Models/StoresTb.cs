using System;
using System.Collections.Generic;

namespace EF.Models
{
    public partial class StoresTb
    {
        public long Id { get; set; }
        public long ClientId { get; set; }
        public string NameAr { get; set; }
        public string NameEn { get; set; }
        public string DescAr { get; set; }
        public string DescEn { get; set; }
        public double? Lat { get; set; }
        public double? Lng { get; set; }
        public string Address { get; set; }
        public int? CityId { get; set; }
        public bool? IsActive { get; set; }

        public virtual ClientTb Client { get; set; }
    }
}
