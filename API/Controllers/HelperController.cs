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
    public class HelperController : ControllerBase
    {
        [AllowAnonymous]
        [HttpGet]
        public List<CitiesTb> GetAllCities()
        {
            return CitiesDAL.GetAllCities();
        }
        [HttpGet]
        public List<CategoryTb> GetAllCats()
        {
            return LoadDAL.GetAllCats();
        }
        [HttpGet]
        public List<PackageTypesTb> GetAllPackageTypes()
        {
            return LoadDAL.GetAllPackageTypes();
        }

        [HttpGet]
        public List<DailyNumOfOrdersTb> GetAllNumOfOrders()
        {
            return LoadDAL.GetAllNumOfOrders();
        }

        [HttpGet]
        public List<PackagePerparationTimesTb> GetAllPreparationTimes()
        {
            return LoadDAL.GetAllPreparationTimes();
        }

        [HttpGet]
        public List<StoresTbModel> GetAllStores()
        {
            long clientid = Convert.ToInt64(HttpContext.Request.Headers["UserId"]);
            return LoadDAL.GetAllStores(clientid);
        }
        [HttpGet]
        public SetupDataModel GetSetupData()
        {
            return LoadDAL.GetSetupData();
        }
    }
}
