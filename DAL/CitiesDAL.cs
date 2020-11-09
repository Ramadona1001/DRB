
using EF;
using EF.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using VM;

namespace DAL
{
    public static class CitiesDAL
    {
        public static List<CitiesTb> GetAllCities()
        {
            try
            {
                var db = new drbContext();
                var r = db.CitiesTb.Where(c => c.IsActive == true).ToList();
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
