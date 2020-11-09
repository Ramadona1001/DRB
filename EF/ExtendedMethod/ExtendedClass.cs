using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;

namespace EF.Models
{

    /*      **Exampple How To Scaffolding DB from SQL Server
                Scaffold-DbContext "Data Source=LAPTOP-SPU04J46;Initial Catalog=drb;Integrated Security=True" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models -Force

            **Use DB connection inside configure function
                if (!optionsBuilder.IsConfigured)
                {
                  //Remote
                  optionsBuilder.UseSqlServer("Data Source=ServerIP;Initial Catalog=DBNameHere;Persist Security Info=True;User ID=UserID;Password=Password");
                  //Local
                  optionsBuilder.UseSqlServer("Data Source=LAPTOP-SPU04J46;Initial Catalog=DBNameHere;Integrated Security=True");
                }
     */

    //here we put stored procedures new classes
    public partial class drbContext
    {
        public virtual DbSet<GetAllUsers_Result> GetAllUsers_Result { get; set; }
        public virtual DbSet<GetAppTerms_Result> GetAppTerms_Result { get; set; }
        public virtual DbSet<GetAboutAppInfo_Result> GetAboutAppInfo_Result { get; set; }
        public virtual DbSet<StoresTbModel> StoresTbModel { get; set; }
        public virtual DbSet<GetAllOrders_Result> GetAllOrders_Result { get; set; }
        public virtual DbSet<GetAllMerchantBalanceLog_Result> GetAllMerchantBalanceLog_Result { get; set; }
        public virtual DbSet<GetDriverReport_Result> GetDriverReport_Result { get; set; }
        public virtual DbSet<GetAllDriverBalanceLog_Result> GetAllDriverBalanceLog_Result { get; set; }
        public virtual DbSet<GetDistanceBetweenTwoPoints_Result> GetDistanceBetweenTwoPoints_Result { get; set; }
        public virtual DbSet<GetDriversForAssignment_Result> GetDriversForAssignment_Result { get; set; }
        public virtual DbSet<GetAllClients_Result> GetAllClients_Result { get; set; }
        //
    }

    public partial class ClientTb
    {
        [NotMapped]
        public string PasswordNe { get; set; }
        [NotMapped]
        public string[] MerchantCatsArr
        {
            get
            {
                if (!string.IsNullOrWhiteSpace(MerchantCats))
                {
                    try
                    {
                        return MerchantCats.Split(",");
                    }
                    catch (Exception)
                    {
                        return null;
                    }
                }
                return null;
            }
        }
        [NotMapped]
        public bool IsApproved { get; set; }
        [NotMapped]
        public bool IsCompleted { get; set; }
    }
    public partial class GetAllUsers_Result
    {
        [Key]
        public int Id { get; set; }
        public string FullName { get; set; }
        public string EmailAddress { get; set; }
        public string Password { get; set; }
        public string Mobile { get; set; }
        public Nullable<int> RuleId { get; set; }
        public Nullable<System.DateTime> CreationDate { get; set; }
        public Nullable<bool> isActive { get; set; }
        public string RuleName { get; set; }
        public Nullable<int> Overall_count { get; set; }
    }
    public partial class GetAppTerms_Result
    {
        [Key]
        public byte Id { get; set; }
        public string TermsAndConditionsAr { get; set; }
        public string TermsAndConditionsEn { get; set; }
    }
    public partial class GetAboutAppInfo_Result
    {
        [Key]
        public byte Id { get; set; }
        public string AboutAppNameAr { get; set; }
        public string AboutAppNameEn { get; set; }
        public string AboutAppDescAr { get; set; }
        public string AboutAppDescEn { get; set; }
        public string AddressAr { get; set; }
        public string AddressEn { get; set; }
        public string WorkingHoursAr { get; set; }
        public string WorkingHoursEn { get; set; }
        public string ContactPhones { get; set; }
        public string ContactEmail { get; set; }
        public string WhatsappPhone { get; set; }
    }
    public partial class SetupDataModel
    {
        public List<CategoryTb> AllCats { get; set; }
        public List<PackageTypesTb> AllPackageTypes { get; set; }
        public List<StoresTb> AllStores { get; set; }
        public List<CitiesTb> AllCities { get; set; }
    }

    public partial class MerchantCompleteDataProfile
    {
        public ClientTb clientData { get; set; }
        public List<StoresTbModel> StoresTbModel { get; set; }
        public List<PackagePerparationTimesTb> AllTimes { get; set; }
        public List<DailyNumOfOrdersTb> AllOrdersNum { get; set; }
        public int sts { get; set; }
    }

    public partial class SaveOrderModel
    {
        public ClientTb clientData { get; set; }
        public string OrderNumber { get; set; }
        public int sts { get; set; }
    }

    public partial class OrdersTb
    {
        [NotMapped]
        public double? Lat { get; set; }
        [NotMapped]
        public double? Lng { get; set; }
        [NotMapped]
        public List<OrdersItemsTb> PackagesItems { get; set; }
        [NotMapped]
        public List<string> OrderItemsList { get; set; }
        [NotMapped]
        public string LatLng { get; set; }
        [NotMapped]
        public string tokenId { get; set; }
        [NotMapped]
        public int Degree { get; set; }
    }
    public partial class MerchantHomeModel
    {
        public List<OrdersTb> OrderList { get; set; }
        public long CurrentOrders { get; set; }
        public long FinishedOrders { get; set; }
        public long NextOrders { get; set; }
    }

    public partial class StoresTbModel
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
        public string CityName { get; set; }

    }
    public partial class StoresTb
    {
        [NotMapped]
        public string CityName { get; set; }
    }

    public partial class GetAllOrders_Result
    {
        [Key]
        public long Id { get; set; }
        public string OrderNumber { get; set; }
        public long MerchantIdFK { get; set; }
        public Nullable<long> DriverIdFK { get; set; }
        public long StoreIdFK { get; set; }
        public System.DateTime PackagesTakenDate { get; set; }
        public Nullable<System.DateTime> DeliveryDate { get; set; }
        public decimal OrderPrice { get; set; }
        public decimal OrderPriceAfterAppCommission { get; set; }
        public string ClientPhone { get; set; }
        public Nullable<int> ClientCityIdFK { get; set; }
        public string ClientAddress { get; set; }
        public Nullable<double> ClientLat { get; set; }
        public Nullable<double> ClientLng { get; set; }
        public string Notes { get; set; }
        public byte StatusIdFK { get; set; }
        public Nullable<double> StoreLat { get; set; }
        public Nullable<double> StoreLng { get; set; }
        public string StoreNameAr { get; set; }
        public string StoreCityNameAr { get; set; }
        public string ClientCityNameAr { get; set; }
        public string DriverName { get; set; }
        public string DriverMobile { get; set; }
        public Nullable<decimal> Balance { get; set; }
        public string StatusNameAr { get; set; }
        public Nullable<double> Percentage { get; set; }
        public string Icon { get; set; }
        public string Color { get; set; }
        public string OrderItems { get; set; }
        public string CancelReson { get; set; }
        public Nullable<long> Overall_count { get; set; }

        [NotMapped]
        public double? Lat { get { return ClientLat; } }
        [NotMapped]
        public double? Lng { get { return ClientLng; } }
        [NotMapped]
        public string PackagesTakenDateStr
        {
            get
            {
                if (PackagesTakenDate != null)
                    return ((DateTime)PackagesTakenDate).ToString("dd/MM/yyyy");
                return "";
            }
        }
        [NotMapped]
        public string DeliveryDateStr
        {
            get
            {
                if (DeliveryDate != null)
                    return ((DateTime)DeliveryDate).ToString("dd/MM/yyyy");
                return "";
            }
        }
        [NotMapped]
        public List<string> OrderItemsList
        {
            get
            {
                if (!string.IsNullOrWhiteSpace(OrderItems))
                {
                    return OrderItems.Split(",").ToList();
                }
                return null;
            }
        }
    }
    public partial class GetAllMerchantBalanceLog_Result
    {
        [Key]
        public long Id { get; set; }
        public System.DateTime CreationDate { get; set; }
        public decimal OrderPrice { get; set; }
        public byte TransactionTypeFK { get; set; }
        public Nullable<long> OrderIdFK { get; set; }
        public string OrderNumber { get; set; }
        public string StatusNameAr { get; set; }
        public string TransactionNameAr { get; set; }
        public string Color { get; set; }
        public Nullable<decimal> Balance { get; set; }
        public Nullable<long> Overall_count { get; set; }

        [NotMapped]
        public string CreationDateStr
        {
            get
            {
                if (CreationDate != null)
                    return ((DateTime)CreationDate).ToString("dd/MM/yyyy");
                return "";
            }
        }
    }

    public partial class GetAllDriverBalanceLog_Result
    {
        [Key]
        public long Id { get; set; }
        public Nullable<System.DateTime> CreationDate { get; set; }
        public decimal OrderPrice { get; set; }
        public long OrderIdFK { get; set; }
        public string OrderNumber { get; set; }
        public string StatusNameAr { get; set; }
        public string Color { get; set; }
        public Nullable<decimal> Balance { get; set; }
        public Nullable<decimal> WithdrawBalance { get; set; }
        public Nullable<long> Overall_count { get; set; }
        [NotMapped]
        public string CreationDateStr
        {
            get
            {
                if (CreationDate != null)
                    return ((DateTime)CreationDate).ToString("dd/MM/yyyy");
                return "";
            }
        }
    }
    public partial class GetDriverReport_Result
    {
        [Key]
        public long Id { get; set; }
        public double? TotalPoints { get; set; }
        public int? AvgRatings { get; set; }
    }
    public partial class GetDistanceBetweenTwoPoints_Result
    {
        [Key]
        public Nullable<double> DistanceKM { get; set; }
    }
    public partial class GetDriversForAssignment_Result
    {
        [Key]
        public long Id { get; set; }
        public long? InProgress { get; set; }
        public double? DriverCircleDistanceKm { get; set; }
        public Nullable<double> DistanceKM { get; set; }
    }
    public partial class GetAllClients_Result
    {
        [Key]
        public long Id { get; set; }
        public string Mobile { get; set; }
        public string ClientName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string ConfirmCode { get; set; }
        public byte TypeIdFK { get; set; }
        public Nullable<int> CityId { get; set; }
        public string ProfileImage { get; set; }
        public bool IsActive { get; set; }
        public bool isDeleted { get; set; }
        public bool isBlocked { get; set; }
        public bool ConfirmedFromAdmin { get; set; }
        public decimal CurrentBalance { get; set; }
        public string RegistrationId { get; set; }
        public Nullable<double> Age { get; set; }
        public bool NotifyMe { get; set; }
        public System.DateTime RegisterationDate { get; set; }
        public string lang { get; set; }
        public Nullable<byte> MerchantTypeId { get; set; }
        public string MerchantName { get; set; }
        public string MerchantCats { get; set; }
        public Nullable<int> MerchantCityId { get; set; }
        public Nullable<byte> MerchantDailyNumOfOrdersId { get; set; }
        public Nullable<byte> MerchantPackagePerpTimesId { get; set; }
        public Nullable<byte> MerchantPackageSizeId { get; set; }
        public string MerchantCommercialNum { get; set; }
        public string MerchantMaroofURL { get; set; }
        public decimal MerchantShippingPrice { get; set; }
        public string DriverCarType { get; set; }
        public string DriverCarColor { get; set; }
        public string DriverCarNumber { get; set; }
        public string DriverCarImage { get; set; }
        public string DriverCarFormImage { get; set; }
        public string DriverNationalImage { get; set; }
        public string DriverDrivingLicense { get; set; }
        public string DriverIdentityNumber { get; set; }
        public Nullable<double> DriverCenterLat { get; set; }
        public Nullable<double> DriverCenterLng { get; set; }
        public Nullable<double> DriverCircleDistanceKM { get; set; }
        public double TotalPoints { get; set; }
        public decimal DriverWithDrawBalance { get; set; }
        public string MerchantDailyNumOfOrdersNameAr { get; set; }
        public string MerchantPackagePerpTimesNameAr { get; set; }
        public string MerchantPackageSizeNameAr { get; set; }
        public Nullable<long> WaitClientAddressCount { get; set; }
        public Nullable<long> WaitDriverCount { get; set; }
        public Nullable<long> DriverAcceptNotTakeOrderCount { get; set; }
        public Nullable<long> DriverTakeOrderToDeliverCount { get; set; }
        public Nullable<long> DoneCount { get; set; }
        public Nullable<long> CancelCount { get; set; }
        public string CatsNamesItems { get; set; }
        public string MerchantStoresItems { get; set; }
        public Nullable<long> Overall_count { get; set; }
    }
}

