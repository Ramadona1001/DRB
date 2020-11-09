
using EF;
using EF.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Net.Mime;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using VM;

namespace DAL
{
    public static class HelperDAL
    {

        public static int pr = 99;
        public static string token1 = "9125XX30@*$4d_db$jKl0$2$65XVv$a004Dlo0n32751";
        public static string token2 = "74536ArhT&$$ds!@$4ertgDFUo225**&@$!varCa9332";

        //settings
        public static string ReturenRandom()
        {
            Random r = new Random();
            var x = r.Next(0, 1000);
            string code = x.ToString("0000");
            code = "1234";
            return code;
        }
        public static bool sendMail(string subject, string body, string toEmail)
        {
            return true;
            try
            {
                //email & pass
                //old email --->  esmo394@gmail.com
                string Email = "";
                string Password = "";

                MailMessage msg = new MailMessage();
                msg.From = new MailAddress("");
                msg.To.Add(new MailAddress(toEmail));
                msg.Subject = subject;
                msg.IsBodyHtml = true;
                msg.AlternateViews.Add(AlternateView.CreateAlternateViewFromString(body, null, MediaTypeNames.Text.Html));

                SmtpClient smtpClient = new SmtpClient("smtp.mailgun.org", Convert.ToInt32(587));
                smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtpClient.UseDefaultCredentials = false;
                System.Net.NetworkCredential credentials = new System.Net.NetworkCredential(Email, Password);
                smtpClient.Credentials = credentials;
                smtpClient.EnableSsl = true;
                smtpClient.Send(msg);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public static string sendMail2(string subject, string body, string toEmail)
        {
            try
            {
                //email & pass
                string Email = "Info.HamzaCenter@gmail.com";
                string Password = "FGBAxcvXT*eZ1cd_!$$sZ%%cvu";

                MailMessage msg = new MailMessage();
                msg.From = new MailAddress("Info.HamzaCenter@gmail.com");
                msg.To.Add(new MailAddress(toEmail));
                msg.Subject = subject;
                msg.IsBodyHtml = true;
                msg.AlternateViews.Add(AlternateView.CreateAlternateViewFromString(body, null, MediaTypeNames.Text.Html));

                SmtpClient smtpClient = new SmtpClient("smtp.gmail.com", Convert.ToInt32(587));
                smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtpClient.UseDefaultCredentials = false;
                System.Net.NetworkCredential credentials = new System.Net.NetworkCredential(Email, Password);
                smtpClient.Credentials = credentials;
                smtpClient.EnableSsl = true;
                smtpClient.Send(msg);
                return "1";
            }
            catch (Exception ex)
            {
                return "0";
            }
        }

        public static string SendGetSMS(string phone, string msg)
        {
            return "1";
            try
            {
                msg = HttpUtility.UrlEncode(msg);
                phone = TrimPhone(phone);
                string html = string.Empty;
                string url = @"http://basic.unifonic.com/rest/SMS/messages?AppSid=XXXXXXXXXXXXXXXX&SenderID=XXXXXXXXX&Body=" + msg + "&Recipient=" + phone + "&responseType=JSON&baseEncode=True&encoding=UTF8";
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                request.Method = "POST";
                request.Headers["Authorization"] = "Basic aj@wafeersa.com:123123";
                request.ContentType = "application/json";
                request.AutomaticDecompression = DecompressionMethods.GZip;
                using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                using (Stream stream = response.GetResponseStream())
                using (StreamReader reader = new StreamReader(stream))
                {
                    html = reader.ReadToEnd();
                }
                return "1";
            }
            catch (Exception ex)
            {
                return "0";
            }
            //Console.WriteLine(html);
        }
        public static string TrimPhone(string phone)
        {
            if (phone.StartsWith("966"))
            {
                return phone;
            }
            else
            {
                if (phone.StartsWith("05"))
                {
                    return "966" + phone.Substring(1, phone.Length - 1);
                }
                else
                {
                    if (phone.StartsWith("5") && phone.Length == 9)
                    {
                        return "966" + phone;
                    }
                    else
                    {
                        return "0";
                        //Interaction.MsgBox("خطأ في رقم الهاتف");
                    }
                }
            }
        }
        public static string HashMd5(string pass)
        {
            var sha1 = MD5.Create();
            var step1 = Encoding.UTF8.GetBytes(pass);
            var step2 = sha1.ComputeHash(step1);
            return string.Join("", step2.Select(x => x.ToString("X2"))).ToLower();
        }

        public static List<string> FindDriverForAssignment(long orderid, long? storeId)
        {
            List<string> regids = new List<string>();
            try
            {
                var db = new drbContext();
                var storedata = db.StoresTb.FirstOrDefault(c => c.Id == storeId);
                if (storedata != null)
                {
                    var drivers = db.GetDriversForAssignment_Result.FromSqlRaw("GetDriversForAssignment {0},{1},{2}", orderid, storedata.Lat, storedata.Lng).AsEnumerable<GetDriversForAssignment_Result>().ToList();
                    if (drivers != null && drivers.Count() > 0)
                    {
                        drivers = drivers.Where(c => c.DriverCircleDistanceKm != null && c.DistanceKM != null && c.DriverCircleDistanceKm >= c.DistanceKM).OrderByDescending(c => new { c.InProgress, c.DistanceKM }).ToList();
                        if (drivers != null && drivers.Count() > 0)
                        {
                            var orderdata = db.OrdersTb.FirstOrDefault(c => c.Id == orderid);
                            orderdata.DriverIdFk = drivers.FirstOrDefault().Id;
                            orderdata.StatusIdFk = 2;//wait untill driver confirm
                            orderdata.LastChangeDate = DateTime.Now;

                            OrdersDriversRequestsLogsTb l = new OrdersDriversRequestsLogsTb()
                            {
                                DriverId = (long)orderdata.DriverIdFk,
                                OrderId = orderid
                            };
                            db.OrdersDriversRequestsLogsTb.Add(l);

                            db.SaveChanges();

                            //notify client that there is a driver for his order
                            //HelperDAL.sendMail2("تم تعيين سائق لطلبك", "تم تعيين سائق لطلبك", "ahmedrefaiyandroid@gmail.com");
                            var client = db.ClientTb.FirstOrDefault(c => c.Id == orderdata.DriverIdFk);
                            if (client.NotifyMe == true)
                                regids.Add(client.RegistrationId);
                        }

                        return regids;
                    }
                }
                return regids;
            }
            catch (Exception ex)
            {
                return regids;
            }
        }

        public static async Task<string> SendOneSignalNotificationListUsers(IHttpClientFactory _clientFactory, List<string> devicesToken, string strMsg, string MsgPrms = "")
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
