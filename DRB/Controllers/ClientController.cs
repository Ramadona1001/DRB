using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using DRB.Models;
using DAL;
using EF.Models;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Net.Http;
using System.Text;

namespace DRB.Controllers
{
    public class ClientController : Controller
    {
        private readonly IHttpClientFactory _clientFactory;

        public ClientController(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
        }


        [Route("youraddress/{id}/{e}")]
        public IActionResult Index(string id, int e)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(id) && id.IndexOf(HelperDAL.token1) > 0 && id.IndexOf(HelperDAL.token2) > 0)
                {
                    string code = id;
                    var originalCode = code.Substring(0, code.IndexOf(HelperDAL.token1));
                    code = code.Replace(originalCode + HelperDAL.token1, "");
                    code = code.Replace(HelperDAL.token2, "");

                    var orderId = Convert.ToInt64(code);

                    var orderResult = MerchantDAL.GetAllOrders(1, 2, null, null, null, orderId, null, null);
                    if (orderResult == null || orderResult.Count() == 0)
                        return View(null);

                    var order = orderResult.FirstOrDefault();
                    ViewBag.ClientCityIdFk = new SelectList(CitiesDAL.GetAllCities(), "Id", "NameAr");

                    if (e == 1)
                    {
                        string msg = "تم الحفظ بنجاح";
                        ViewBag.success = msg;
                        ViewBag.error = "";
                    }
                    else if (e == 99)
                    {
                        string msg = "حدث خطأ برجاء المحاوله في وقت لاحق";
                        ViewBag.success = "";
                        ViewBag.error = msg;
                    }
                    else if (e == 999)
                    {
                        string msg = "الرجاء التحقق من تعبئة جميع الحقول";
                        ViewBag.success = "";
                        ViewBag.error = msg;
                    }
                    else if (e == 9999)
                    {
                        string msg = "غير مسموح التعامل مع هذا الطلب، تحقق من صحة الهاتف او كود التأكيد، ان كنت تظن ان هناك خطأ تواصل مع التاجر الخاص بطلبك";
                        ViewBag.success = "";
                        ViewBag.error = msg;
                    }
                    else if (e == 0)
                    {
                        ViewBag.success = "";
                        ViewBag.error = "";
                    }

                    return View(new OrdersTb()
                    {
                        OrderNumber = order.OrderNumber,
                        OrderItemsList = order.OrderItemsList,
                        tokenId = id
                    });
                }
                return View(null);
            }
            catch (Exception)
            {
                return View(null);
            }
        }

        [HttpPost]
        public IActionResult Save(OrdersTb model)
        {
            try
            {
                string id = model.tokenId;
                if (!string.IsNullOrWhiteSpace(id) && id.IndexOf(HelperDAL.token1) > 0 && id.IndexOf(HelperDAL.token2) > 0 && !string.IsNullOrWhiteSpace(model.ClientPhone)
                    && !string.IsNullOrWhiteSpace(model.ClientAddress) && model.ClientConfirmCode > 0 && model.ClientLat > 0 && model.ClientLng > 0 && model.ClientCityIdFk > 0
                    && model.DeliveryDate != null)
                {
                    string code = id;
                    var originalCode = code.Substring(0, code.IndexOf(HelperDAL.token1));
                    code = code.Replace(originalCode + HelperDAL.token1, "");
                    code = code.Replace(HelperDAL.token2, "");

                    var orderId = Convert.ToInt64(code);
                    var db = new drbContext();
                    var orderResult = db.OrdersTb.FirstOrDefault(c => c.Id == orderId && c.ClientPhone == model.ClientPhone && c.ClientConfirmCode == model.ClientConfirmCode);
                    if (orderResult == null)
                        return RedirectToAction("Index", "Client", new { id = model.tokenId, e = 9999 });


                    orderResult.ClientCityIdFk = model.ClientCityIdFk;
                    orderResult.ClientAddress = model.ClientAddress;
                    orderResult.ClientLat = model.ClientLat;
                    orderResult.ClientLng = model.ClientLng;
                    orderResult.DeliveryDate = model.DeliveryDate;
                    orderResult.LastChangeDate = DateTime.Now;
                    if (orderResult.StatusIdFk == 1)
                    {
                        orderResult.StatusIdFk = 2;
                        OrdersLogsTb l = new OrdersLogsTb()
                        {
                            Date = DateTime.Now,
                            OrderIdFk = orderId,
                            StatusIdFk = 2,
                            Note = "تم تحديد عنوان العميل وبإنتظار قبول المندوب"
                        };
                        db.OrdersLogsTb.Add(l);
                    }
                    else
                    {
                        OrdersLogsTb l = new OrdersLogsTb()
                        {
                            Date = DateTime.Now,
                            OrderIdFk = orderId,
                            StatusIdFk = orderResult.StatusIdFk,
                            Note = "قام العميل بتغيير عنوانه"
                        };
                        db.OrdersLogsTb.Add(l);
                    }



                    db.SaveChanges();

                    //recommend driver
                    //Functio To get Nearest Driver ()
                    if (orderResult.DriverIdFk == null)
                    {
                        Task.Run(() =>
                        {
                            var r = HelperDAL.FindDriverForAssignment(orderId, orderResult.StoreIdFk);
                            if (r.Count() > 0)
                            {
                                SendOneSignalNotificationListUsers(r, "لديك شحنة جديدة", "");
                            }
                        });
                    }
                    //check phone and code

                    return RedirectToAction("Index", "Client", new { id = model.tokenId, e = 1 });
                }
                return RedirectToAction("Index", "Client", new { id = model.tokenId, e = 999 });
            }
            catch (Exception)
            {
                return RedirectToAction("Index", "Client", new { id = model.tokenId, e = 99 });
            }
        }

        [Route("ratedriver/{id}/{e}")]
        public IActionResult Rating(string id, int e)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(id) && id.IndexOf(HelperDAL.token1) > 0 && id.IndexOf(HelperDAL.token2) > 0)
                {
                    string code = id;
                    var originalCode = code.Substring(0, code.IndexOf(HelperDAL.token1));
                    code = code.Replace(originalCode + HelperDAL.token1, "");
                    code = code.Replace(HelperDAL.token2, "");

                    var orderId = Convert.ToInt64(code);

                    var orderResult = MerchantDAL.GetAllOrders(1, 2, null, null, null, orderId, null, null);
                    if (orderResult == null || orderResult.Count() == 0)
                        return View(null);

                    var order = orderResult.FirstOrDefault();
                    ViewBag.ClientCityIdFk = new SelectList(CitiesDAL.GetAllCities(), "Id", "NameAr");

                    if (e == 1)
                    {
                        string msg = "تم الحفظ بنجاح";
                        ViewBag.success = msg;
                        ViewBag.error = "";
                    }
                    else if (e == 99)
                    {
                        string msg = "حدث خطأ برجاء المحاوله في وقت لاحق";
                        ViewBag.success = "";
                        ViewBag.error = msg;
                    }
                    else if (e == 999)
                    {
                        string msg = "الرجاء التحقق من تحديد تقييم";
                        ViewBag.success = "";
                        ViewBag.error = msg;
                    }
                    else if (e == 9999)
                    {
                        string msg = "غير مسموح التعامل مع هذا الطلب";
                        ViewBag.success = "";
                        ViewBag.error = msg;
                    }
                    else if (e == 0)
                    {
                        ViewBag.success = "";
                        ViewBag.error = "";
                    }
                    var db = new drbContext();
                    var orderonly = db.DriversRatingsTb.FirstOrDefault(c => c.OrderIdFk == orderId);

                    return View(new OrdersTb()
                    {
                        OrderNumber = order.OrderNumber,
                        OrderItemsList = order.OrderItemsList,
                        Degree = orderonly == null ? 0 : orderonly.Degree,
                        tokenId = id
                    });
                }
                return View(null);
            }
            catch (Exception)
            {
                return View(null);
            }
        }

        [HttpPost]
        public IActionResult SaveRating(OrdersTb model)
        {
            try
            {
                string id = model.tokenId;
                if (!string.IsNullOrWhiteSpace(id) && id.IndexOf(HelperDAL.token1) > 0 && id.IndexOf(HelperDAL.token2) > 0 && !string.IsNullOrWhiteSpace(model.ClientPhone)
                    && model.ClientConfirmCode > 0 && model.Degree > 0)
                {
                    string code = id;
                    var originalCode = code.Substring(0, code.IndexOf(HelperDAL.token1));
                    code = code.Replace(originalCode + HelperDAL.token1, "");
                    code = code.Replace(HelperDAL.token2, "");

                    var orderId = Convert.ToInt64(code);
                    var db = new drbContext();
                    var orderResult = db.OrdersTb.FirstOrDefault(c => c.Id == orderId && c.ClientPhone == model.ClientPhone && c.ClientConfirmCode == model.ClientConfirmCode);
                    if (orderResult == null)
                        return RedirectToAction("Rating", "Client", new { id = model.tokenId, e = 9999 });


                    DriversRatingsTb d = new DriversRatingsTb()
                    {
                        CreationDate = DateTime.Now,
                        Degree = model.Degree,
                        DriverIdFk = (long)orderResult.DriverIdFk,
                        OrderIdFk = orderId
                    };
                    db.DriversRatingsTb.Add(d);
                    db.SaveChanges();

                    return RedirectToAction("Rating", "Client", new { id = model.tokenId, e = 1 });
                }
                return RedirectToAction("Rating", "Client", new { id = model.tokenId, e = 999 });
            }
            catch (Exception)
            {
                return RedirectToAction("Rating", "Client", new { id = model.tokenId, e = 99 });
            }
        }

        private async Task<string> SendOneSignalNotificationListUsers(List<string> devicesToken, string strMsg, string MsgPrms = "")
        {
            try
            {
                string AppId = "XXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX";
                int type = 0;

                string strarray = "";
                string lastItem = devicesToken[devicesToken.Count - 1];
                foreach (var item in devicesToken)
                {
                    if (item == lastItem)
                        strarray += "\"" + item + "\"";
                    else
                        strarray += "\"" + item + "\",";
                }

                var request = new HttpRequestMessage(HttpMethod.Post,
                "https://onesignal.com/api/v1/notifications");


                request.Headers.Add("authorization", "Basic XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");


                //HttpClientHandler clientHandler = new HttpClientHandler();
                //clientHandler.ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;

                HttpClient client = _clientFactory.CreateClient();
                string contentdata = "{"
                                                        + "\"app_id\": \"" + AppId + "\","
                                                        + "\"data\": {\"dataid\": \"" + type + "\",\"type\": \"4\",\"msgprms\": \"" + MsgPrms + "\"},"
                                                        + "\"contents\": {\"en\": \"" + strMsg + "\"},"
                                                        + "\"ios_badgeType\": \"Increase\","
                                                        + "\"ios_badgeCount\": \"1\","
                                                        + "\"include_player_ids\": [" + strarray + "]}";

                request.Content = new StringContent(contentdata, Encoding.UTF8, "application/json");

                var response = await client.SendAsync(request);
                var responseString = await response.Content.ReadAsStringAsync();
                return responseString.ToString();
            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
                //return false;
            }
        }


    }
}
