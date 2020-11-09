using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Models;
using DAL;
using EF.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using VM;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [EnableCors("AllowOrigin")]
    [APIAuthentication]
    public class InfoController : ControllerBase
    {
        [AllowAnonymous]
        [HttpGet]
        public GetAppTerms_Result GetAppTerms()
        {
            return InfoDAL.GetAppTerms();
        }

        [AllowAnonymous]
        [HttpGet]
        public GetAboutAppInfo_Result GetAboutAppInfo()
        {
            return InfoDAL.GetAboutAppInfo();
        }
    }
}
