using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using API.Models;
using DAL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VM;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [EnableCors("AllowOrigin")]
    [APIAuthentication]
    public class ClientController : ControllerBase
    {
        private readonly IHttpClientFactory _clientFactory;

        public ClientController(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
        }


        [HttpGet]
        public string SaveRegIdsWithLang(string regid)
        {
            try
            {
                long clientid = Convert.ToInt64(HttpContext.Request.Headers["UserId"]);
                ClientDAL.SaveRegIdsWithLang(clientid, regid);
                return "1";
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        public bool Contactus([FromForm] ContactUsModel model)
        {
            long clientid = Convert.ToInt64(HttpContext.Request.Headers["UserId"]);
            model.ClientId = clientid;
            return HelperDAL.sendMail("استفسار من العميل " + model.Name, "ايميل المستخدم: " + model.Email + "" + model.SMS, "");
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
