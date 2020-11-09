using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using API.Models;
using DAL;
using EF.Models;
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
    public class DriverController : ControllerBase
    {

        private readonly IHttpClientFactory _clientFactory;

        public DriverController(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
        }



        [HttpPost]
        public MerchantCompleteDataProfile SaveDriverCompleteData([FromForm] ClientTb model)
        {
            long clientid = Convert.ToInt64(HttpContext.Request.Headers["UserId"]);
            model.Id = clientid;
            return DriverDAL.SaveDriverCompleteData(model);
        }

        [HttpPost]
        public List<GetAllOrders_Result> GetAllOrders(string sts, int pagenum, int pagesize)
        {
            try
            {
                long clientid = Convert.ToInt64(HttpContext.Request.Headers["UserId"]);
                return MerchantDAL.GetAllOrders(pagenum, pagesize, null, clientid, sts, null, null, null);
            }
            catch (Exception)
            {
                return null;
            }
        }
        [HttpPost]
        public GetDriverReport_Result GetDriverReport()
        {
            try
            {
                long clientid = Convert.ToInt64(HttpContext.Request.Headers["UserId"]);
                return DriverDAL.GetDriverReport(clientid);
            }
            catch (Exception)
            {
                return null;
            }
        }
        [HttpPost]
        public List<GetAllDriverBalanceLog_Result> GetAllDriverBalanceLog(int pagenum, int pagesize)
        {
            try
            {
                long clientid = Convert.ToInt64(HttpContext.Request.Headers["UserId"]);
                return DriverDAL.GetAllDriverBalanceLog(pagenum, pagesize, clientid);
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        public int ManageConfirmOrder([FromForm] OrdersTb model)
        {
            try
            {
                long clientid = Convert.ToInt64(HttpContext.Request.Headers["UserId"]);
                return DriverDAL.ManageConfirmOrder(clientid, model.Id, model.IsReturned, _clientFactory);
            }
            catch (Exception)
            {
                return 0;
            }
        }
        [HttpPost]
        public int ManageOrder([FromForm] OrdersTb model)
        {
            try
            {
                long clientid = Convert.ToInt64(HttpContext.Request.Headers["UserId"]);
                return DriverDAL.ManageOrder(clientid, model.Id, model.StatusIdFk);
            }
            catch (Exception)
            {
                return 0;
            }
        }

    }
}
