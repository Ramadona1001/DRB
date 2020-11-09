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
    public class AccountController : ControllerBase
    {
        [HttpPost]
        [AllowAnonymous]
        public ClientViewModel Authenticate([FromForm] ClientTb model)
        {
            string IP = "";
            try
            {
                var remoteIpAddress = Request.HttpContext.Connection.RemoteIpAddress;
                IP = remoteIpAddress == null ? "" : remoteIpAddress.MapToIPv4().ToString();
            }
            catch (Exception ex)
            {
            }
            return ClientDAL.AuthenticateClient(model.Mobile, model.Password, IP);
        }
        [HttpPost]
        [AllowAnonymous]
        public ClientViewModel Authentication([FromForm] ClientTb model)
        {
            string IP = "";
            var remoteIpAddress = Request.HttpContext.Connection.RemoteIpAddress;
            IP = remoteIpAddress == null ? "" : remoteIpAddress.MapToIPv4().ToString();
            return ClientDAL.AutoAuthentication(model.Mobile, model.Password, IP);
        }
        [HttpPost]
        [AllowAnonymous]
        public bool ChangePassword_Authenticate(string Mobile, string Pass, string textCode)
        {
            return ClientDAL.ChangePass(Mobile, Pass, textCode);
        }
        [HttpPost]
        [AllowAnonymous]
        public ClientViewModel SignUp([FromForm] ClientTb model)
        {
            var remoteIpAddress = Request.HttpContext.Connection.RemoteIpAddress;
            string IP = remoteIpAddress == null ? "" : remoteIpAddress.MapToIPv4().ToString();
            return ClientDAL.SignupClient(model, IP);
        }
        [HttpPost]
        public ClientViewModel EditAccount([FromForm] ClientTb model)
        {
            long clientid = Convert.ToInt64(HttpContext.Request.Headers["UserId"]);
            ClientTb cliententity = new ClientTb()
            {
                Id = clientid,
                Mobile = model.Mobile,
                ClientName = model.ClientName,
                Email = model.Email,
                Password = model.Password,
                PasswordNe = model.PasswordNe,
                Age = model.Age
            };
            var remoteIpAddress = Request.HttpContext.Connection.RemoteIpAddress;
            string IP = remoteIpAddress == null ? "" : remoteIpAddress.MapToIPv4().ToString();
            return ClientDAL.EditAccount(cliententity, IP); //edit client account
        }
        [HttpPost]
        [AllowAnonymous]
        public bool CheckCode([FromForm] ClientTb model)
        {
            return ClientDAL.CheckCode(model.Mobile, model.ConfirmCode);//check code to change active to true;
        }
        [HttpGet]
        [AllowAnonymous]
        public bool ForgetPassword(string mobile)
        {
            return ClientDAL.ForgotPassword(mobile); //send sms with new password to client mobile
        }

        [HttpGet]
        [AllowAnonymous]
        public bool ResetMyLoginData(string mobile)
        {
            return ClientDAL.ResetMyLoginData(mobile); //send sms with new password to client mobile
        }

        [HttpGet]
        [AllowAnonymous]
        public bool SendNewCode(int id, string mobile)
        {
            return ClientDAL.SendNewCode(id, mobile); //send sms with new password to client mobile
        }
        [HttpGet]
        public long RemoveAccount()
        {
            long clientid = Convert.ToInt64(HttpContext.Request.Headers["UserId"]);
            return ClientDAL.DeleteClient(clientid);
        }
        [HttpGet]
        [AllowAnonymous]
        public bool CheckConfirmCode(int id, string code)
        {
            return ClientDAL.CheckConfirmCode(id, code); //send sms with new password to client mobile
        }
    }
}
