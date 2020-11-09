using DAL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DRB.Models
{
    public class AreaAuthenticationAttribute : TypeFilterAttribute
    {
        public AreaAuthenticationAttribute() : base(typeof(AreaAuthenticationFilter))
        {

        }
    }

    public class AreaAuthenticationFilter : IAuthorizationFilter
    {
        public string UserId { get; set; }
        public string UserRule { get; set; }
        public string Token { get; set; }
        public string AutKey { get; set; }
        public string Roles { get; set; }

        public void OnAuthorization(AuthorizationFilterContext filterContext)
        {
            UserId = filterContext.HttpContext.Request.Cookies.FirstOrDefault(c => c.Key == "UserId").Value;
            AutKey = filterContext.HttpContext.Request.Cookies.FirstOrDefault(c => c.Key == "AuthKey").Value;
            UserRule = filterContext.HttpContext.Request.Cookies.FirstOrDefault(c => c.Key == "UserRule").Value;

            var controller = ((object[])filterContext.RouteData.Values.Values)[0];
            var action = ((object[])filterContext.RouteData.Values.Values)[1];
            if (((Microsoft.AspNetCore.Mvc.Controllers.ControllerActionDescriptor)filterContext.ActionDescriptor).MethodInfo.GetCustomAttributes(typeof(AllowAnonymousAttribute), true).Any())
            {
                ;
            }
            else
            {
                if (!string.IsNullOrWhiteSpace(UserId) && !string.IsNullOrWhiteSpace(AutKey) && !string.IsNullOrWhiteSpace(UserRule) && AutKey == HelperDAL.HashMd5(UserId.ToString() + UserRule.ToString() + AdminDAL.tempKey))
                {


                }
                else
                    filterContext.Result = new RedirectResult("~/Admin/Logout");
            }
        }
    }
}
