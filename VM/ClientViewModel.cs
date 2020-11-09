using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VM
{
    public class ClientViewModel
    {
        public long UserId { get; set; }
        public string Name { get; set; }
        public string AuthKey_ { get; set; }
        public int UserStatus { get; set; }
        public string UserMobile { get; set; }
        public int Pr { get; set; }
        public string Email { get; set; }
        public string authKey { get; set; }
        public bool IsActive { get; set; }
        public bool IsBlocked { get; set; }
        public string NotifyMe { get; set; }
        public string Male { get; set; }
        public string Female { get; set; }
        public double? Age { get; set; }
        public byte TypeIdFk { get; set; }
        public bool IsApproved { get; set; }
        public bool IsCompleted { get; set; }

        public double? Lat { get; set; }
        public double? Lng { get; set; }
        public double? CircleKm { get; set; }
    }
    public class ContactUsModel
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string SMS { get; set; }
        public long ClientId { get; set; }
    }
}
