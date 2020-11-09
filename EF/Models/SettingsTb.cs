using System;
using System.Collections.Generic;

namespace EF.Models
{
    public partial class SettingsTb
    {
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
        public string TermsAndConditionsAr { get; set; }
        public string TermsAndConditionsEn { get; set; }
        public string TermsAndConditionsDriversAr { get; set; }
        public string TermsAndConditionsDriversEn { get; set; }
        public double SystemProfitPercentagePerOrder { get; set; }
        public double DriverPointsPerEachOrder { get; set; }
        public decimal SystemTotalProfit { get; set; }
        public decimal SystemProfitFromOrderCancel { get; set; }
        public decimal MarchantDefaultShippingPrice { get; set; }
    }
}
