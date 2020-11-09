
using EF;
using EF.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using VM;

namespace DAL
{
    public static class DriverDAL
    {
        public static MerchantCompleteDataProfile SaveDriverCompleteData(ClientTb data)
        {
            MerchantCompleteDataProfile model = new MerchantCompleteDataProfile()
            {
                clientData = null
            };
            try
            {
                var db = new drbContext();

                model.clientData = new ClientTb();

                var dataOld = db.ClientTb.FirstOrDefault(c => c.Id == data.Id);
                dataOld.DriverCenterLat = data.DriverCenterLat;
                dataOld.DriverCenterLng = data.DriverCenterLng;
                dataOld.DriverCircleDistanceKm = data.DriverCircleDistanceKm;

                model.clientData.IsApproved = dataOld.ConfirmedFromAdmin;
                model.clientData.IsCompleted = dataOld.DriverCenterLat > 0 ? true : false;
                model.clientData.DriverCenterLat = dataOld.DriverCenterLat;
                model.clientData.DriverCenterLng = dataOld.DriverCenterLng;
                model.clientData.DriverCircleDistanceKm = dataOld.DriverCircleDistanceKm;

                db.SaveChanges();

                return model;

            }
            catch (Exception)
            {
                return null;
            }
        }

        public static GetDriverReport_Result GetDriverReport(long driverid)
        {
            try
            {
                var db = new drbContext();
                var r = db.GetDriverReport_Result.FromSqlRaw("GetDriverReport {0}", driverid).AsEnumerable<GetDriverReport_Result>().FirstOrDefault();
                return r;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public static List<GetAllDriverBalanceLog_Result> GetAllDriverBalanceLog(int pageNumber, int pageSize, long driverId)
        {
            try
            {
                var db = new drbContext();
                var r = db.GetAllDriverBalanceLog_Result.FromSqlRaw("GetAllDriverBalanceLog {0}, {1}, {2}", driverId, pageNumber, pageSize).AsEnumerable<GetAllDriverBalanceLog_Result>().ToList();
                if (r != null && r.Count() == 0)
                    return null;
                return r;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public static int ManageConfirmOrder(long DriverID, long orderNumber, bool agree, IHttpClientFactory _clientFactory)
        {
            try
            {
                var db = new drbContext();
                var order = db.OrdersTb.FirstOrDefault(c => c.Id == orderNumber && c.DriverIdFk == DriverID);
                if (order == null)
                    return -1;//havn't permission for this order
                if (order.StatusIdFk != 2)
                    return -1;//havn't permission for this order

                if (agree)
                {
                    //change order sts - log driver acceptance -- send notification to the merchant
                    order.StatusIdFk = 3;
                    order.LastChangeDate = DateTime.Now;
                    OrdersDriversRequestsLogsTb o = new OrdersDriversRequestsLogsTb()
                    {
                        Agreed = agree,
                        DriverId = DriverID,
                        OrderId = orderNumber
                    };
                    db.OrdersDriversRequestsLogsTb.Add(o);

                    OrdersLogsTb l = new OrdersLogsTb()
                    {
                        Date = DateTime.Now,
                        OrderIdFk = orderNumber,
                        StatusIdFk = 3,
                        Note = "قبول السائق " + DriverID + " للطلب"
                    };
                    db.OrdersLogsTb.Add(l);

                    db.SaveChanges();

                    HelperDAL.sendMail2("تم تعيين سائق لطلبك", "تم تعيين سائق لطلبك", "ahmedrefaiyandroid@gmail.com");

                    return 1;
                }
                else
                {
                    //remove driver -- log driver refused -- recommend another driver
                    OrdersDriversRequestsLogsTb o = new OrdersDriversRequestsLogsTb()
                    {
                        Agreed = agree,
                        DriverId = DriverID,
                        OrderId = orderNumber
                    };
                    db.OrdersDriversRequestsLogsTb.Add(o);

                    //recommend another driver
                    //Functio To get Nearest Driver
                    order.DriverIdFk = null;
                    order.LastChangeDate = DateTime.Now;
                    db.SaveChanges();

                    Task.Run(() =>
                    {
                        var r = HelperDAL.FindDriverForAssignment(order.Id, order.StoreIdFk);
                        if (r.Count() > 0)
                        {
                            HelperDAL.SendOneSignalNotificationListUsers(_clientFactory, r, "لديك شحنة جديدة", "");
                        }
                    });

                    return 1;
                }
            }
            catch (Exception ex)
            {
                return 0;
            }
        }

        public static int ManageOrder(long DriverID, long orderNumber, byte sts)
        {
            try
            {
                var db = new drbContext();
                var order = db.OrdersTb.FirstOrDefault(c => c.Id == orderNumber && c.DriverIdFk == DriverID);
                if (order == null)
                    return -1;//havn't permission for this order

                if (order.StatusIdFk == 3)//make it 4 -- he take order from store
                {
                    order.StatusIdFk = 4;
                    order.LastChangeDate = DateTime.Now;
                    OrdersLogsTb l = new OrdersLogsTb()
                    {
                        Date = DateTime.Now,
                        OrderIdFk = orderNumber,
                        StatusIdFk = 4,
                        Note = "استلم السائق " + DriverID + " الشحنة من المستودع وجاري التوصيل"
                    };
                    db.OrdersLogsTb.Add(l);

                    db.SaveChanges();

                    HelperDAL.sendMail2("استلم السائق الشحنة وجاري التوصيل", "استلم السائق الشحنة وجاري التوصيل", "ahmedrefaiyandroid@gmail.com");

                    return 1;
                }
                else if (order.StatusIdFk == 4)//make it 5 -- he deliver it to client
                {

                    order.StatusIdFk = 5;
                    order.LastChangeDate = DateTime.Now;
                    order.ClientConfirmCode = Convert.ToInt32(HelperDAL.ReturenRandom());
                    OrdersLogsTb l = new OrdersLogsTb()
                    {
                        Date = DateTime.Now,
                        OrderIdFk = orderNumber,
                        StatusIdFk = 5,
                        Note = "تم تسليم الشحنة للعميل"
                    };
                    db.OrdersLogsTb.Add(l);

                    DriversProfitLogTb l2 = new DriversProfitLogTb()
                    {
                        CreationDate = DateTime.Now,
                        OrderIdFk = orderNumber,
                        DriverIdFk = order.Id,
                        Balance = order.OrderPriceAfterAppCommission
                    };
                    db.DriversProfitLogTb.Add(l2);

                    var settings = db.SettingsTb.FirstOrDefault(c => c.Id == 1);
                    settings.SystemTotalProfit = settings.SystemTotalProfit + order.AppCommission;

                    var client = db.ClientTb.FirstOrDefault(c => c.Id == order.DriverIdFk);
                    client.CurrentBalance = client.CurrentBalance + order.OrderPriceAfterAppCommission;
                    client.TotalPoints = client.TotalPoints + settings.DriverPointsPerEachOrder;

                    SystemProfitLogTb l3 = new SystemProfitLogTb()
                    {
                        CreationDate = DateTime.Now,
                        OrderIdFk = orderNumber,
                        Balance = order.AppCommission,
                        Note = "تم توصيل الطلب بنجاح"
                    };
                    db.SystemProfitLogTb.Add(l3);


                    db.SaveChanges();

                    //send sms to client with url to rate driver
                    var urlCode = "" + HelperDAL.ReturenRandom() + HelperDAL.token1 + order.Id + HelperDAL.token2;
                    var url = "https://localhost:44315/ratedriver/" + urlCode + "/0";
                    string sms = url + "  -  كود التأكيد هو " + order.ClientConfirmCode;

                    HelperDAL.sendMail2("تم توصيل الشحنة بنجاح", "تم توصيل الشحنة بنجاح، يمكنك تقييم السائق من هنا " + sms, "ahmedrefaiyandroid@gmail.com");
                    return 1;
                }
                else
                {
                    return -1;//havn't permission for this order
                }
            }
            catch (Exception ex)
            {
                return 0;
            }
        }

    }
}
