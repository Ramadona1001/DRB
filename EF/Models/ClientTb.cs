using System;
using System.Collections.Generic;

namespace EF.Models
{
    public partial class ClientTb
    {
        public ClientTb()
        {
            MerchantBalanceLogTb = new HashSet<MerchantBalanceLogTb>();
            StoresTb = new HashSet<StoresTb>();
        }

        public long Id { get; set; }
        public string Mobile { get; set; }
        public string ClientName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string ConfirmCode { get; set; }
        public byte TypeIdFk { get; set; }
        public int? CityId { get; set; }
        public string ProfileImage { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsBlocked { get; set; }
        public bool ConfirmedFromAdmin { get; set; }
        public decimal CurrentBalance { get; set; }
        public string RegistrationId { get; set; }
        public double? Age { get; set; }
        public bool? NotifyMe { get; set; }
        public DateTime RegisterationDate { get; set; }
        public string Lang { get; set; }
        public byte? MerchantTypeId { get; set; }
        public string MerchantName { get; set; }
        public string MerchantCats { get; set; }
        public int? MerchantCityId { get; set; }
        public byte? MerchantDailyNumOfOrdersId { get; set; }
        public byte? MerchantPackagePerpTimesId { get; set; }
        public byte? MerchantPackageSizeId { get; set; }
        public string MerchantCommercialNum { get; set; }
        public string MerchantMaroofUrl { get; set; }
        public decimal MerchantShippingPrice { get; set; }
        public string DriverCarType { get; set; }
        public string DriverCarColor { get; set; }
        public string DriverCarNumber { get; set; }
        public string DriverCarImage { get; set; }
        public string DriverCarFormImage { get; set; }
        public string DriverNationalImage { get; set; }
        public string DriverDrivingLicense { get; set; }
        public string DriverIdentityNumber { get; set; }
        public double? DriverCenterLat { get; set; }
        public double? DriverCenterLng { get; set; }
        public double? DriverCircleDistanceKm { get; set; }
        public double TotalPoints { get; set; }
        public decimal DriverWithDrawBalance { get; set; }

        public virtual ClientTypesTb TypeIdFkNavigation { get; set; }
        public virtual ICollection<MerchantBalanceLogTb> MerchantBalanceLogTb { get; set; }
        public virtual ICollection<StoresTb> StoresTb { get; set; }
    }
}
