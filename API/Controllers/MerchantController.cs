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
    public class MerchantController : ControllerBase
    {

        [HttpGet]
        public MerchantCompleteDataProfile GetMerchantCompleteData(bool getDrop)
        {
            try
            {
                long clientid = Convert.ToInt64(HttpContext.Request.Headers["UserId"]);
                return MerchantDAL.GetMerchantCompleteData(clientid, getDrop);
            }
            catch (Exception)
            {
                return null;
            }
        }
        [HttpPost]
        public int EditStore([FromForm] StoresTb model)
        {
            long clientid = Convert.ToInt64(HttpContext.Request.Headers["UserId"]);
            model.ClientId = clientid;
            return MerchantDAL.EditStore(model);
        }

        [HttpPost]
        public StoresTb AddStore([FromForm] StoresTb model)
        {
            long clientid = Convert.ToInt64(HttpContext.Request.Headers["UserId"]);
            model.ClientId = clientid;
            return MerchantDAL.AddStore(model);
        }

        [HttpPost]
        public int DeleteStore([FromForm] StoresTb model)
        {
            long clientid = Convert.ToInt64(HttpContext.Request.Headers["UserId"]);
            model.ClientId = clientid;
            return MerchantDAL.DeleteStore(model);
        }

        [HttpPost]
        public MerchantCompleteDataProfile SaveMerchantCompleteData([FromForm] ClientTb model)
        {
            long clientid = Convert.ToInt64(HttpContext.Request.Headers["UserId"]);
            model.Id = clientid;
            return MerchantDAL.SaveMerchantCompleteData(model);
        }

        [HttpPost]
        public MerchantHomeModel GetMerchantHomeModel()
        {
            long clientid = Convert.ToInt64(HttpContext.Request.Headers["UserId"]);
            return MerchantDAL.GetMerchantHomeModel(clientid);
        }

        [HttpPost]
        public ClientTb GetMerchantBalanceWithOrderPrice()
        {
            long clientid = Convert.ToInt64(HttpContext.Request.Headers["UserId"]);
            return MerchantDAL.GetMerchantBalanceWithOrderPrice(clientid);
        }

        [HttpPost]
        public SaveOrderModel SaveNewOrder([FromForm] OrdersTb model)
        {
            long clientid = Convert.ToInt64(HttpContext.Request.Headers["UserId"]);
            model.MerchantIdFk = clientid;
            return MerchantDAL.SaveNewOrder(model);
        }

        [HttpPost]
        public SaveOrderModel ChargeBalance([FromForm] ClientTb model)
        {
            long clientid = Convert.ToInt64(HttpContext.Request.Headers["UserId"]);
            model.Id = clientid;
            return MerchantDAL.ChargeBalance(model);
        }

        [HttpPost]
        public List<GetAllOrders_Result> GetAllOrders(long? num, int pagenum, int pagesize)
        {
            try
            {
                long clientid = Convert.ToInt64(HttpContext.Request.Headers["UserId"]);
                return MerchantDAL.GetAllOrders(pagenum, pagesize, clientid, null, null, num, null, null);
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        public List<GetAllMerchantBalanceLog_Result> GetAllMerchantBalanceLog(int pagenum, int pagesize)
        {
            try
            {
                long clientid = Convert.ToInt64(HttpContext.Request.Headers["UserId"]);
                return MerchantDAL.GetAllMerchantBalanceLog(pagenum, pagesize, clientid);
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        public List<GetAllOrders_Result> CancelOrder([FromForm] OrdersTb model)
        {
            try
            {
                long clientid = Convert.ToInt64(HttpContext.Request.Headers["UserId"]);
                return MerchantDAL.CancelOrder(clientid, model.Id, model.CancelReson);
            }
            catch (Exception)
            {
                return null;
            }
        }

    }
}
