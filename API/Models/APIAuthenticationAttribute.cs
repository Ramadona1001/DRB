using DAL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace API.Models
{
    public class APIAuthenticationAttribute : ActionFilterAttribute
    {
        public string UserId { get; set; }
        public string Email { get; set; }
        public string authKey { get; set; }
        public string PlanId { get; set; }
        public override void OnActionExecuting(ActionExecutingContext actionExecutedContext)
        {
            try
            {
                // this allow all AllowAnonymousAttribute action from authorize
                var controllerActionDescriptor = actionExecutedContext.ActionDescriptor;
                if (controllerActionDescriptor != null)
                {
                    try
                    {
                        var values = actionExecutedContext.HttpContext.Request.Headers["Origins"].ToString();
                        //InfoDAL.SaveRequest(values);
                        if (true /*(values.Trim() == "") || values == null || values == "file://" || values.Contains("http://localhost:") || values.Contains("https://localhost")*/)
                        {
                            ;
                        }
                        else
                        {
                            actionExecutedContext.HttpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;

                            actionExecutedContext.Result = new JsonResult(new { HttpStatusCode.Unauthorized });
                        }
                    }
                    catch (Exception)
                    {
                        actionExecutedContext.HttpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;

                        actionExecutedContext.Result = new JsonResult(new { HttpStatusCode.Unauthorized });
                    }

                    if (((Microsoft.AspNetCore.Mvc.Controllers.ControllerActionDescriptor)actionExecutedContext.ActionDescriptor).MethodInfo.GetCustomAttributes(typeof(Microsoft.AspNetCore.Authorization.AllowAnonymousAttribute), true).Any())
                    {
                        actionExecutedContext.HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
                    }
                    else
                    {
                        UserId = actionExecutedContext.HttpContext.Request.Headers["UserId"];
                        if (UserId == "" || UserId == null)
                        {
                            //comment it for debug only
                            actionExecutedContext.HttpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;

                            actionExecutedContext.Result = new JsonResult(new { HttpStatusCode.Unauthorized });
                        }
                        else
                        {
                            authKey = actionExecutedContext.HttpContext.Request.Headers["authKey"];
                            Email = actionExecutedContext.HttpContext.Request.Headers["Email"];
                            PlanId = actionExecutedContext.HttpContext.Request.Headers["Pr"];

                            var remoteIpAddress = actionExecutedContext.HttpContext.Connection.RemoteIpAddress;
                            string IP = remoteIpAddress == null ? "" : remoteIpAddress.MapToIPv4().ToString();

                            string mdvstring = HelperDAL.HashMd5(this.UserId + this.PlanId + ClientDAL.tempKey + IP);
                            if (mdvstring.ToLower() == this.authKey.ToLower())
                            {
                                actionExecutedContext.HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
                            }
                            else
                            {
                                actionExecutedContext.HttpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                                actionExecutedContext.Result = new JsonResult(new { HttpStatusCode.Unauthorized });

                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                actionExecutedContext.HttpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                actionExecutedContext.Result = new JsonResult(new { HttpStatusCode.Unauthorized });

            }
        }
    }
}
