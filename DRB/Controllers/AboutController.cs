using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using DRB.Models;
using EF.Models;

namespace DRB.Controllers
{
    [AreaAuthentication]
    public class AboutController : Controller
    {
        public ActionResult Index(int id = 0)
        {
            using (var db = new drbContext())
            {
                var data = db.SettingsTb.Find((byte)1);
                if (id == 1)
                {
                    string msg = "تم الحفظ بنجاح";
                    if(Request.Cookies.FirstOrDefault(x => x.Key == "Lang").Value=="en")
                        msg = "Saved Successfully";
                    ViewBag.success = msg;
                    ViewBag.error = "";
                }
                else if (id == 99)
                {
                    string msg = "حدث خطأ برجاء المحاوله في وقت لاحق";
                    if (Request.Cookies.FirstOrDefault(x => x.Key == "Lang").Value == "en")
                        msg = "Error, try again later";
                    ViewBag.success = "";
                    ViewBag.error = msg;
                }
                return View(data);
            }
        }
        [HttpPost]
        public ActionResult Index(SettingsTb data)
        {
            try
            {
                using (var db = new drbContext())
                {
                    var obj = db.SettingsTb.Find((byte)1);
                    obj.AboutAppDescAr = data.AboutAppDescAr;
                    obj.AboutAppNameAr = data.AboutAppNameAr;
                    data = null;
                    db.SaveChanges();
                    return RedirectToAction("index", new { id = 1 });
                }
            }
            catch (Exception)
            {
                return RedirectToAction("index", new { id = 99 });
            }
        }
    }
}
