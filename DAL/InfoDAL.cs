
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
    public static class InfoDAL
    {
        public static GetAppTerms_Result GetAppTerms()
        {
            try
            {
                var db = new drbContext();
                var Offers = db.GetAppTerms_Result.FromSqlRaw("GetAppTerms").AsEnumerable<GetAppTerms_Result>().FirstOrDefault();
                return Offers;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public static GetAboutAppInfo_Result GetAboutAppInfo()
        {
            try
            {
                var db = new drbContext();
                var Offers = db.GetAboutAppInfo_Result.FromSqlRaw("GetAboutAppInfo").AsEnumerable<GetAboutAppInfo_Result>().FirstOrDefault();
                return Offers;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

    }
}
