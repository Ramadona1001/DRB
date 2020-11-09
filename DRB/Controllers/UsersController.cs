using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using DRB.Models;
using DAL;
using Microsoft.AspNetCore.Mvc.Rendering;
using EF.Models;
using X.PagedList;
using Newtonsoft.Json;

namespace DRB.Controllers
{
    [AreaAuthentication]
    public class UsersController : Controller
    {
        //public ActionResult Index(string searchString, int? type, int page = 1)
        //{
        //    ViewBag.SearchString = searchString ?? "";
        //    if (type == 0)
        //        type = null;
        //    ViewBag.type = type;
        //    if (!(searchString != null && searchString != "" && searchString.ToLower() != "undefined"))
        //    {
        //        searchString = null;
        //    }
        //    page = page < 1 ? 1 : page;
        //    var model = AdminDAL.GetAllUsers(page, 20, searchString, type, null);
        //    ViewBag.super = AdminDAL.GetAllUsers(page, 2000000, searchString, 2, null);
        //    var totalItemCount = model == null || model.Count() == 0 ? 1 : model.FirstOrDefault().Overall_count;
        //    var modelAsIPagedList = new StaticPagedList<GetAllUsers_Result>(model, page, 20, totalItemCount == null ? 1 : (int)totalItemCount);
        //    var isAjax = Request.Headers["X-Requested-With"] == "XMLHttpRequest";
        //    return isAjax
        //    ? (ActionResult)PartialView("_PartialAllUsers", modelAsIPagedList)
        //    : View(modelAsIPagedList);
        //}
       
        //public ActionResult Create(int error = 0)
        //{
        //    ViewBag.RuleId = new SelectList(AdminDAL.GetAllRules(), "Id", "RuleName");

        //    if (error == 999)
        //    {
        //        string msg = "خطأ, حاول مرة أخري لاحقا";
        //        ViewBag.ErrorMsg = msg;
        //        ViewBag.Error = "block";
        //    }
        //    else if (error == 9999)
        //    {
        //        string msg = "خطأ, الرجاء التحقق من إدخال جميع الحقول";
        //        ViewBag.ErrorMsg = msg;
        //        ViewBag.Error = "block";
        //    }
        //    else if (error == 99)
        //    {
        //        string msg = "خطأ, البريد الإلكتروني أو رقم الهاتف مستخدم من قبل";
        //        ViewBag.ErrorMsg = msg;
        //        ViewBag.Error = "block";
        //    }
        //    else
        //        ViewBag.Error = "none";

        //    return View();
        //}

        ////Create new one (post)
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public ActionResult Create(UserTb usersTB)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        var flag = AdminDAL.AddUser(usersTB);
        //        if (flag > 0)
        //            return RedirectToAction("Index");
        //        else if (flag == 0)
        //            return RedirectToAction("Create", new { error = 999 });
        //        else if (flag == -2)
        //            return RedirectToAction("Create", new { error = 99 });
        //    }
        //    return RedirectToAction("Create", new { error = 9999 });
        //}

        // edit User (get)
        public ActionResult Edit(int? id, int error = 0, string available = null)
        {
            var userid = Convert.ToInt32(Request.Cookies.FirstOrDefault(x => x.Key == "UserId").Value);
            var userRole = Convert.ToInt32(Request.Cookies.FirstOrDefault(x => x.Key == "UserRule").Value);


            if (userRole == 3 || id == null)
            {
                id = userid;
                ViewBag.title = "برفايلي";
            }
            else
            {
                ViewBag.title = "تعديل مستخدم";
            }

            if (error == 999)
            {
                string msg = "خطأ, حاول مرة أخري لاحقا";
                ViewBag.ErrorMsg = msg;
                ViewBag.Error = "block";
                ViewBag.Success = "none";
            }
            else if (error == 9999)
            {
                string msg = "خطأ, الرجاء التحقق من إدخال جميع الحقول";
                ViewBag.ErrorMsg = msg;
                ViewBag.Error = "block";
                ViewBag.Success = "none";
            }
            else if (error == 100)
            {
                ViewBag.ErrorMsg = "تم الحفظ بنجاح";
                ViewBag.Error = "none";
                ViewBag.Success = "block";
            }
            else if (error == 99)
            {
                string msg = "خطأ, البريد الإلكتروني أو رقم الهاتف مستخدم من قبل";
                ViewBag.ErrorMsg = msg;
                ViewBag.Error = "block";
                ViewBag.Success = "none";
            }
            else
            {
                ViewBag.Error = "none";
                ViewBag.Success = "none";
            }

            UserTb usersTB = AdminDAL.GetuserByid((int)id);
            usersTB.Password = "";
            ViewBag.RuleId = new SelectList(AdminDAL.GetAllRules(), "Id", "RuleName", usersTB.RuleId);
            if (usersTB == null)
            {
                return RedirectToAction("Index");
            }
            return View(usersTB);
        }

        // edit User (post)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(UserTb usersTB)
        {
            var flag = AdminDAL.EditUser(usersTB);
            if (flag > 0)
                return RedirectToAction("Edit", new { id = usersTB.Id, error = 100 });
            else if (flag == 0)
                return RedirectToAction("Edit", new { id = usersTB.Id, error = 999 });
            else if (flag == -2)
                return RedirectToAction("Edit", new { id = usersTB.Id, error = 99 });

            return RedirectToAction("Edit", new { error = 9999 });
        }
    }
}
