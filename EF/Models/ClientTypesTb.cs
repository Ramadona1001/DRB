using System;
using System.Collections.Generic;

namespace EF.Models
{
    public partial class ClientTypesTb
    {
        public ClientTypesTb()
        {
            ClientTb = new HashSet<ClientTb>();
        }

        public byte Id { get; set; }
        public string NameAr { get; set; }
        public string NameEn { get; set; }

        public virtual ICollection<ClientTb> ClientTb { get; set; }
    }
}
