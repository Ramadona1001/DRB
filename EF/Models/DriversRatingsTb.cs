using System;
using System.Collections.Generic;

namespace EF.Models
{
    public partial class DriversRatingsTb
    {
        public long Id { get; set; }
        public long DriverIdFk { get; set; }
        public long OrderIdFk { get; set; }
        public int Degree { get; set; }
        public string Notes { get; set; }
        public DateTime? CreationDate { get; set; }
    }
}
