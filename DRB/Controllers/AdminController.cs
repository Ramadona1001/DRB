using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DAL;
using DRB.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using VM;

namespace DRB.Controllers
{
    [AreaAuthentication]
    public class AdminController : Controller
    {
        private IConfiguration _config;

        public AdminController(IConfiguration configuration)
        {
            _config = configuration;
        }

        // GET: User
        [AllowAnonymous]
        public ActionResult Login(int errorid = 0)
        {
            if (Request.Cookies.FirstOrDefault(x => x.Key == "UserId").Value == null)
            {
                if (errorid == 0)
                {
                    ViewBag.Error = "none";
                    return View();
                }
                else
                {
                    ViewBag.Error = "block";
                    ViewBag.ErrorType = "1";
                    return View();
                }
            }
            else
            {
                //un-comment these lines when there are multiplr roles
                //string urole = Request.Cookies.FirstOrDefault(x => x.Key == "UserRule").Value;
                //if (urole == "1")
                return RedirectToAction("Index", "Dashboard");
            }
        }

        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public ActionResult Login([FromForm] LoginViewModel model)
        {
            if (string.IsNullOrWhiteSpace(model.UserName) || string.IsNullOrWhiteSpace(model.Password))
                return RedirectToAction("Login", new { errorid = 99 });
            var data = AdminDAL.UserLogin(model);
            if (data.Sts == 1)
            {
                CookieOptions option = new CookieOptions();
                if (model.remember)
                    option.Expires = DateTime.Now.AddMonths(1);
                option.IsEssential = true;
                Response.Cookies.Append("UserId", data.Id.ToString(), option);
                Response.Cookies.Append("UserRule", data.UserRule.ToString(), option);
                Response.Cookies.Append("UserName", data.UserName, option);
                Response.Cookies.Append("UserEmail", data.Email, option);
                Response.Cookies.Append("AuthKey", data.AuthKey, option);
                //if (data.UserRule == 1)
                return RedirectToAction("Index", "Dashboard");
                //return RedirectToAction("Index", "CallCenter");
            }
            else
            {
                return RedirectToAction("Login", new { errorid = 99 });
            }
        }

        public ActionResult SaveSiteTheme(string s)
        {
            CookieOptions option = new CookieOptions();
            option.Expires = DateTime.Now.AddMonths(1);
            option.IsEssential = true;
            Response.Cookies.Append("UserTheme", s, option);
            return Json(true);
        }

        [AllowAnonymous]
        public ActionResult Logout()
        {
            foreach (var cookie in Request.Cookies.Keys)
            {
                if (cookie != "UserTheme")
                    Response.Cookies.Delete(cookie);
            }
            return RedirectToAction("Login");
        }
    }
}