using System;
using System.Collections.Generic;

namespace EF.Models
{
    public partial class OrdersTb
    {
        public OrdersTb()
        {
            DriversProfitLogTb = new HashSet<DriversProfitLogTb>();
            OrdersDriversRequestsLogsTb = new HashSet<OrdersDriversRequestsLogsTb>();
            OrdersItemsTb = new HashSet<OrdersItemsTb>();
            OrdersLogsTb = new HashSet<OrdersLogsTb>();
        }

        public long Id { get; set; }
        public long MerchantIdFk { get; set; }
        public string OrderNumber { get; set; }
        public string OrderImage { get; set; }
        public double? OrderWeight { get; set; }
        public long StoreIdFk { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime PackagesTakenDate { get; set; }
        public int NumOfPackages { get; set; }
        public string ClientPhone { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public int? ClientCityIdFk { get; set; }
        public string ClientAddress { get; set; }
        public double? ClientLat { get; set; }
        public double? ClientLng { get; set; }
        public byte? PaymentTypeIdFk { get; set; }
        public byte StatusIdFk { get; set; }
        public long? DriverIdFk { get; set; }
        public decimal OrderPrice { get; set; }
        public decimal AppCommission { get; set; }
        public decimal OrderPriceAfterAppCommission { get; set; }
        public string Notes { get; set; }
        public string PaymentNotes { get; set; }
        public string PaymentId { get; set; }
        public bool? IsActive { get; set; }
        public string CancelReson { get; set; }
        public string DeliveryImage { get; set; }
        public bool IsReturned { get; set; }
        public DateTime? LastChangeDate { get; set; }
        public int? ClientConfirmCode { get; set; }

        public virtual PaymentTypesTb PaymentTypeIdFkNavigation { get; set; }
        public virtual OrderStatusTb StatusIdFkNavigation { get; set; }
        public virtual ICollection<DriversProfitLogTb> DriversProfitLogTb { get; set; }
        public virtual ICollection<OrdersDriversRequestsLogsTb> OrdersDriversRequestsLogsTb { get; set; }
        public virtual ICollection<OrdersItemsTb> OrdersItemsTb { get; set; }
        public virtual ICollection<OrdersLogsTb> OrdersLogsTb { get; set; }
    }
}
