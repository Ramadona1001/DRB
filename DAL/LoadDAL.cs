
using EF;
using EF.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using VM;

namespace DAL
{
    public static class LoadDAL
    {
        public static SetupDataModel GetSetupData()
        {
            SetupDataModel model = new SetupDataModel()
            {
                AllCats = null,
                AllCities = null,
                AllPackageTypes = null,
            };
            try
            {
                var db = new drbContext();

                model.AllCats = db.CategoryTb.Where(c => c.IsActive == true).ToList();
                if (model.AllCats != null && model.AllCats.Count() == 0)
                    model.AllCats = null;

                model.AllCities = db.CitiesTb.Where(c => c.IsActive == true).ToList();
                if (model.AllCities != null && model.AllCities.Count() == 0)
                    model.AllCities = null;

                model.AllPackageTypes = db.PackageTypesTb.ToList();
                if (model.AllPackageTypes != null && model.AllPackageTypes.Count() == 0)
                    model.AllPackageTypes = null;

                return model;

            }
            catch (Exception ex)
            {
                return model;
            }
        }

        public static List<CategoryTb> GetAllCats()
        {
            try
            {
                var db = new drbContext();
                var r = db.CategoryTb.Where(c => c.IsActive == true).ToList();
                if (r != null && r.Count() == 0)
                    r = null;
                return r;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public static List<DailyNumOfOrdersTb> GetAllNumOfOrders()
        {
            try
            {
                var db = new drbContext();
                var r = db.DailyNumOfOrdersTb.ToList();
                if (r != null && r.Count() == 0)
                    r = null;
                return r;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public static List<PackagePerparationTimesTb> GetAllPreparationTimes()
        {
            try
            {
                var db = new drbContext();
                var r = db.PackagePerparationTimesTb.ToList();
                if (r != null && r.Count() == 0)
                    r = null;
                return r;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public static List<PackageTypesTb> GetAllPackageTypes()
        {
            try
            {
                var db = new drbContext();
                var r = db.PackageTypesTb.ToList();
                if (r != null && r.Count() == 0)
                    r = null;
                return r;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public static List<StoresTbModel> GetAllStores(long merchantId)
        {
            try
            {
                var db = new drbContext();
                var r = db.StoresTbModel.FromSqlRaw("GetMerchantStores {0}", merchantId).AsEnumerable<StoresTbModel>().ToList();
                if (r != null && r.Count() == 0)
                    r = null;
                return r;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
