
using EF;
using EF.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.EntityFrameworkCore.Query.Internal;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using VM;

namespace DAL
{
    public static class MerchantDAL
    {
        public static MerchantCompleteDataProfile GetMerchantCompleteData(long merchantId, bool getDrop)
        {
            MerchantCompleteDataProfile model = new MerchantCompleteDataProfile()
            {
                AllOrdersNum = null,
                AllTimes = null,
                clientData = null
            };
            try
            {
                var db = new drbContext();
                var r = db.StoresTbModel.FromSqlRaw("GetMerchantStores {0}", merchantId).AsEnumerable<StoresTbModel>().ToList();
                if (r != null && r.Count() == 0)
                    r = null;


                model.clientData = new ClientTb();

                var dataOld = db.ClientTb.FirstOrDefault(c => c.Id == merchantId);
                model.clientData.MerchantName = dataOld.MerchantName;
                model.clientData.MerchantCats = dataOld.MerchantCats;
                model.clientData.MerchantDailyNumOfOrdersId = dataOld.MerchantDailyNumOfOrdersId;
                model.clientData.MerchantPackageSizeId = dataOld.MerchantPackageSizeId;
                model.clientData.MerchantPackagePerpTimesId = dataOld.MerchantPackagePerpTimesId;
                model.clientData.MerchantCommercialNum = dataOld.MerchantCommercialNum;
                model.StoresTbModel = r;

                if (getDrop)
                {
                    model.AllOrdersNum = db.DailyNumOfOrdersTb.ToList();
                    if (model.AllOrdersNum != null && model.AllOrdersNum.Count() == 0)
                        model.AllOrdersNum = null;

                    model.AllTimes = db.PackagePerparationTimesTb.ToList();
                    if (model.AllTimes != null && model.AllTimes.Count() == 0)
                        model.AllTimes = null;
                }

                return model;
            }
            catch (Exception ex)
            {
                return model;
            }
        }
        public static int DeleteStore(StoresTb model)
        {
            try
            {
                var db = new drbContext();
                var store = db.StoresTb.FirstOrDefault(c => c.Id == model.Id && c.ClientId == model.ClientId);
                if (store != null)
                {
                    var order = db.OrdersTb.FirstOrDefault(c => c.StoreIdFk == store.Id && (c.StatusIdFk == 1 || c.StatusIdFk == 2 || c.StatusIdFk == 3 || c.StatusIdFk == 4));
                    if (order != null)
                    {
                        return -2;//can't delete, founded with orders
                    }
                    store.IsActive = false;
                    db.SaveChanges();
                    return 1; //success
                }
                return -1;//not found
            }
            catch (Exception ex)
            {
                return 0;//error, try again
            }
        }
        public static int EditStore(StoresTb model)
        {
            try
            {
                var db = new drbContext();
                var store = db.StoresTb.FirstOrDefault(c => c.Id == model.Id && c.ClientId == model.ClientId);
                if (store != null)
                {
                    store.NameAr = model.NameAr;
                    store.NameEn = model.NameEn;
                    store.Address = model.Address;
                    store.CityId = model.CityId;
                    store.DescAr = model.DescAr;
                    store.DescEn = model.DescEn;
                    store.Lat = model.Lat;
                    store.Lng = model.Lng;
                    db.SaveChanges();
                    return 1; //success
                }
                return -1;//not found
            }
            catch (Exception)
            {
                return 0;//error, try again
            }
        }
        public static StoresTb AddStore(StoresTb model)
        {
            try
            {
                var db = new drbContext();
                var store = db.StoresTb.FirstOrDefault(c => c.NameAr == model.NameAr && c.ClientId == model.ClientId);
                if (store == null)
                {
                    store = new StoresTb();
                    store.NameAr = model.NameAr;
                    store.NameEn = model.NameEn;
                    store.Address = model.Address;
                    store.CityId = model.CityId;
                    store.DescAr = model.DescAr;
                    store.DescEn = model.DescEn;
                    store.Lat = model.Lat;
                    store.Lng = model.Lng;
                    store.IsActive = true;
                    store.ClientId = model.ClientId;

                    db.StoresTb.Add(store);
                    db.SaveChanges();

                    return store; //success
                }
                return new StoresTb() { Id = -1 };//not found
            }
            catch (Exception ex)
            {
                return new StoresTb() { Id = 0 };//error, try again
            }
        }

        public static MerchantCompleteDataProfile SaveMerchantCompleteData(ClientTb data)
        {
            MerchantCompleteDataProfile model = new MerchantCompleteDataProfile()
            {
                AllOrdersNum = null,
                AllTimes = null,
                clientData = null,
                StoresTbModel = null
            };
            try
            {
                var db = new drbContext();

                model.clientData = new ClientTb();

                var dataOld = db.ClientTb.FirstOrDefault(c => c.Id == data.Id);
                dataOld.MerchantName = data.MerchantName;
                dataOld.MerchantCats = data.MerchantCats;
                dataOld.MerchantDailyNumOfOrdersId = data.MerchantDailyNumOfOrdersId;
                dataOld.MerchantPackageSizeId = data.MerchantPackageSizeId;
                dataOld.MerchantPackagePerpTimesId = data.MerchantPackagePerpTimesId;
                dataOld.MerchantCommercialNum = data.MerchantCommercialNum;
                db.SaveChanges();

                var r = db.StoresTbModel.FromSqlRaw("GetMerchantStores {0}", data.Id).AsEnumerable<StoresTbModel>().ToList();
                if (r != null && r.Count() == 0)
                    r = null;

                model.clientData.IsApproved = dataOld.ConfirmedFromAdmin;
                model.clientData.IsCompleted = !string.IsNullOrWhiteSpace(dataOld.MerchantCats) ? true : false;

                model.StoresTbModel = r;

                return model;

            }
            catch (Exception)
            {
                return null;
            }
        }

        public static MerchantHomeModel GetMerchantHomeModel(long merchanTID)
        {
            MerchantHomeModel model = new MerchantHomeModel()
            {
                OrderList = null,
                CurrentOrders = 0,
                FinishedOrders = 0,
                NextOrders = 0
            };
            try
            {
                var db = new drbContext();
                model.OrderList = db.OrdersTb.Where(c => c.MerchantIdFk == merchanTID && (c.StatusIdFk == 3 || c.StatusIdFk == 4)).Select(c => new OrdersTb { Id = c.Id, Lat = c.ClientLat, ClientLng = c.ClientLng, OrderNumber = c.OrderNumber }).ToList();
                model.CurrentOrders = model.OrderList.Count();
                model.FinishedOrders = db.OrdersTb.Count(c => c.MerchantIdFk == merchanTID && (c.StatusIdFk == 5 || c.StatusIdFk == 6));
                model.NextOrders = db.OrdersTb.Count(c => c.MerchantIdFk == merchanTID && (c.StatusIdFk == 1 || c.StatusIdFk == 2));
                return model;
            }
            catch (Exception)
            {
                return model;
            }
        }

        public static ClientTb GetMerchantBalanceWithOrderPrice(long merchantId)
        {
            var model = new ClientTb() { CurrentBalance = 0, MerchantShippingPrice = 0 };
            try
            {
                var db = new drbContext();
                var client = db.ClientTb.FirstOrDefault(c => c.Id == merchantId);
                model.CurrentBalance = client.CurrentBalance;

                model.MerchantShippingPrice = client.MerchantShippingPrice;
                if (model.MerchantShippingPrice == 0)
                    model.MerchantShippingPrice = db.SettingsTb.FirstOrDefault(c => c.Id == 1).MarchantDefaultShippingPrice;


                model.IsApproved = client.ConfirmedFromAdmin;
                model.IsCompleted = !string.IsNullOrWhiteSpace(client.MerchantCats) ? true : false;

                return model;
            }
            catch (Exception)
            {
                return model;
            }
        }

        public static SaveOrderModel SaveNewOrder(OrdersTb data)
        {
            SaveOrderModel model = new SaveOrderModel()
            {
                clientData = null,
                OrderNumber = null,
                sts = 0
            };
            try
            {
                var db = new drbContext();

                var client = db.ClientTb.FirstOrDefault(c => c.Id == data.MerchantIdFk);
                model.clientData = new ClientTb();
                model.clientData.IsApproved = client.ConfirmedFromAdmin;
                model.clientData.IsCompleted = !string.IsNullOrWhiteSpace(client.MerchantCats) ? true : false;

                if (!model.clientData.IsApproved)
                {
                    model.sts = -1;//not approved
                    return model;
                }
                if (!model.clientData.IsCompleted)
                {
                    model.sts = -2;//not completed
                    return model;
                }

                if (data.PackagesItems == null || data.PackagesItems.Count() == 0)
                {
                    model.sts = -3;//add package items
                    return model;
                }

                var settings = db.SettingsTb.FirstOrDefault(c => c.Id == 1);
                var CurrentBalance = client.CurrentBalance;

                var MerchantShippingPrice = client.MerchantShippingPrice;
                if (MerchantShippingPrice == 0)
                    MerchantShippingPrice = settings.MarchantDefaultShippingPrice;

                if (data.PaymentTypeIdFk == 4 && CurrentBalance < MerchantShippingPrice)
                {
                    model.sts = -4;//not enough balance
                    return model;
                }
                var appcommision = Math.Round(Convert.ToDouble(MerchantShippingPrice) * settings.SystemProfitPercentagePerOrder / Convert.ToDouble(100), 1);

                var order = new OrdersTb()
                {
                    MerchantIdFk = data.MerchantIdFk,
                    OrderImage = data.OrderImage,
                    OrderWeight = data.OrderWeight,
                    StoreIdFk = data.StoreIdFk,
                    PackagesTakenDate = data.PackagesTakenDate,
                    ClientPhone = data.ClientPhone,
                    Notes = data.Notes,
                    PaymentTypeIdFk = data.PaymentTypeIdFk,
                    CreationDate = DateTime.Now,
                    OrderPrice = MerchantShippingPrice,
                    IsActive = true,
                    IsReturned = false,
                    AppCommission = Convert.ToDecimal(appcommision),
                    OrderPriceAfterAppCommission = Convert.ToDecimal(MerchantShippingPrice - Convert.ToDecimal(appcommision)),
                    StatusIdFk = 1,
                    ClientConfirmCode = Convert.ToInt32(HelperDAL.ReturenRandom())
                };
                db.OrdersTb.Add(order);
                client.CurrentBalance = client.CurrentBalance - MerchantShippingPrice;
                db.SaveChanges();

                order.OrderNumber = "#" + HelperDAL.ReturenRandom() + "" + order.Id;
                //save items
                data.PackagesItems.All(c =>
                {
                    c.OrderIdFk = order.Id;
                    return true;
                });
                db.OrdersItemsTb.AddRange(data.PackagesItems);

                MerchantBalanceLogTb mlog = new MerchantBalanceLogTb()
                {
                    ClientIdFk = data.MerchantIdFk,
                    Balance = MerchantShippingPrice,
                    PaymentTypeIdFk = data.PaymentTypeIdFk,
                    CreationDate = DateTime.Now,
                    OrderIdFk = order.Id,
                    TransactionTypeFk = 2
                };
                db.MerchantBalanceLogTb.Add(mlog);
                db.SaveChanges();

                model.sts = 1;
                model.OrderNumber = order.OrderNumber;

                //send sms to client with link to enter his address - lat - lng
                var urlCode = "" + HelperDAL.ReturenRandom() + HelperDAL.token1 + order.Id + HelperDAL.token2;
                var url = "https://localhost:44315/youraddress/" + urlCode + "/0";
                string sms = "حدد عنوان ووقت التوصيل من هنا " + url + "  -  كود التأكيد هو " + order.ClientConfirmCode;
                HelperDAL.sendMail2("عنوان ووقت التوصيل", sms, "ahmedrefaiyandroid@gmail.com");
                return model;

            }
            catch (Exception)
            {
                return model;
            }
        }

        public static List<GetAllOrders_Result> GetAllOrders(int pageNumber, int pageSize, long? merchantId, long? driverid, string StatusIds, long? orderNumber, string from, string to)
        {
            try
            {
                var db = new drbContext();
                var r = db.GetAllOrders_Result.FromSqlRaw("GetAllOrders {0}, {1}, {2}, {3}, {4}, {5}, {6}, {7}", merchantId, driverid, StatusIds, from, to, orderNumber, pageNumber, pageSize).AsEnumerable<GetAllOrders_Result>().ToList();
                if (r != null && r.Count() == 0)
                    return null;
                return r;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public static List<GetAllOrders_Result> CancelOrder(long merchantId, long orderNumber, string reason)
        {
            try
            {
                var db = new drbContext();
                var order = db.OrdersTb.FirstOrDefault(c => c.Id == orderNumber && c.MerchantIdFk == merchantId);
                if (order == null)
                    return new List<GetAllOrders_Result>() { new GetAllOrders_Result() { Id = 0 } };//havn't permission for this order
                if (order.StatusIdFk == 4 || order.StatusIdFk == 5 || order.StatusIdFk == 6)
                    return new List<GetAllOrders_Result>() { new GetAllOrders_Result() { Id = -1 } };//can't cancel

                //cancel order
                order.StatusIdFk = 6;
                order.CancelReson = reason;
                order.LastChangeDate = DateTime.Now;

                OrdersLogsTb l = new OrdersLogsTb()
                {
                    Date = DateTime.Now,
                    OrderIdFk = orderNumber,
                    StatusIdFk = 6,
                    Note = "الغاء الطلب"
                };
                db.OrdersLogsTb.Add(l);

                var settings = db.SettingsTb.FirstOrDefault(c => c.Id == 1);
                settings.SystemTotalProfit = settings.SystemTotalProfit + settings.SystemProfitFromOrderCancel;//add cancel profit to system

                var AddedToMerchantBalance = Math.Round(order.OrderPrice - settings.SystemProfitFromOrderCancel); //prepare returned money for client
                var client = db.ClientTb.FirstOrDefault(c => c.Id == merchantId);
                client.CurrentBalance = client.CurrentBalance + AddedToMerchantBalance;

                MerchantBalanceLogTb m = new MerchantBalanceLogTb()
                {
                    ClientIdFk = merchantId,
                    Balance = order.OrderPrice,
                    CreationDate = DateTime.Now,
                    OrderIdFk = order.Id,
                    TransactionTypeFk = 3
                };
                MerchantBalanceLogTb m2 = new MerchantBalanceLogTb()
                {
                    ClientIdFk = merchantId,
                    Balance = settings.SystemProfitFromOrderCancel,
                    CreationDate = DateTime.Now.AddSeconds(30),
                    OrderIdFk = order.Id,
                    TransactionTypeFk = 2,
                    ReasonNote = "بسبب الغاء الطلب"
                };
                db.MerchantBalanceLogTb.Add(m);
                db.MerchantBalanceLogTb.Add(m2);

                SystemProfitLogTb f = new SystemProfitLogTb()
                {
                    Balance = settings.SystemProfitFromOrderCancel,
                    CreationDate = DateTime.Now,
                    OrderIdFk = order.Id,
                    Note = "بسبب الغاء التاجر للطلب"
                };
                db.SystemProfitLogTb.Add(f);

                db.SaveChanges();

                var r = db.GetAllOrders_Result.FromSqlRaw("GetAllOrders {0}, {1}, {2}, {3}, {4}, {5}, {6}, {7}", merchantId, null, null, null, null, orderNumber, 1, 2).AsEnumerable<GetAllOrders_Result>().ToList();
                if (r != null && r.Count() == 0)
                    return null;//error

                return r;
            }
            catch (Exception ex)
            {
                return null;//error
            }
        }

        public static List<GetAllMerchantBalanceLog_Result> GetAllMerchantBalanceLog(int pageNumber, int pageSize, long merchantId)
        {
            try
            {
                var db = new drbContext();
                var r = db.GetAllMerchantBalanceLog_Result.FromSqlRaw("GetAllMerchantBalanceLog {0}, {1}, {2}", merchantId, pageNumber, pageSize).AsEnumerable<GetAllMerchantBalanceLog_Result>().ToList();
                if (r != null && r.Count() == 0)
                    return null;
                return r;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public static SaveOrderModel ChargeBalance(ClientTb data)
        {
            SaveOrderModel model = new SaveOrderModel()
            {
                clientData = null,
                OrderNumber = null,
                sts = 0
            };
            try
            {
                var db = new drbContext();

                var client = db.ClientTb.FirstOrDefault(c => c.Id == data.Id);
                model.clientData = new ClientTb();
                model.clientData.IsApproved = client.ConfirmedFromAdmin;
                model.clientData.IsCompleted = !string.IsNullOrWhiteSpace(client.MerchantCats) ? true : false;

                if (!model.clientData.IsApproved)
                {
                    model.sts = -1;//not approved
                    return model;
                }
                if (!model.clientData.IsCompleted)
                {
                    model.sts = -2;//not completed
                    return model;
                }


                client.CurrentBalance = client.CurrentBalance + data.CurrentBalance;
                db.SaveChanges();

                MerchantBalanceLogTb mlog = new MerchantBalanceLogTb()
                {
                    ClientIdFk = data.Id,
                    Balance = data.CurrentBalance,
                    PaymentTypeIdFk = 1,
                    CreationDate = DateTime.Now,
                    OrderIdFk = null,
                    TransactionTypeFk = 1
                };
                db.MerchantBalanceLogTb.Add(mlog);
                db.SaveChanges();

                model.sts = 1;


                return model;

            }
            catch (Exception)
            {
                return model;
            }
        }

    }
}
