using EF.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Security.Cryptography;
using VM;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Scaffolding;
using System.Globalization;

namespace DAL
{
    public static class AdminDAL
    {
        public static string tempKey = "SeddNJeX!!X0$c12545^!!eAcomDmeMrcIeNarea";
        public static int pr = 1;
        public static LoginViewModel UserLogin(LoginViewModel data)
        {
            LoginViewModel logdata = new LoginViewModel();
            using (var db = new drbContext())
            {
                var userdata = db.UserTb.FirstOrDefault(i => i.EmailAddress.ToLower() == data.UserName.ToLower());
                if (userdata != null && data.UserName != "")
                {
                    if (userdata.EmailAddress.ToLower() == data.UserName.ToLower() && userdata.Password == HelperDAL.HashMd5(data.Password + tempKey))
                    {
                        if (userdata.IsActive != true)
                        {
                            logdata.Sts = 0;//erro on login
                        }
                        else
                        {
                            logdata.Sts = 1;
                            logdata.Id = userdata.Id;
                            logdata.UserName = userdata.FullName;
                            logdata.Email = userdata.EmailAddress;
                            logdata.Mobile = userdata.Mobile;
                            logdata.UserRule = (int)userdata.RuleId;
                            logdata.AuthKey = HelperDAL.HashMd5(userdata.Id.ToString() + userdata.RuleId.ToString() + tempKey);
                        }
                    }
                    else
                    {
                        logdata.Sts = 0;//erro on login
                    }
                }
                else
                {
                    logdata.Sts = 0;//erro on login
                }
            }

            return logdata;

        }

        public static int AddUser(UserTb usersTB)
        {
            try
            {
                using (var db = new drbContext())
                {
                    var founded = db.UserTb.FirstOrDefault(c => c.EmailAddress == usersTB.EmailAddress || c.Mobile == usersTB.Mobile);
                    if (founded != null)
                        return -2;
                    usersTB.Password = HelperDAL.HashMd5(usersTB.Password + tempKey);
                    usersTB.IsActive = true;
                    usersTB.IsDeleted = false;
                    usersTB.CreationDate = DateTime.Now;
                    db.UserTb.Add(usersTB);
                    db.SaveChanges();
                    return usersTB.Id;
                }
            }
            catch (Exception)
            {
                return 0;
            }
        }
        public static int EditUser(UserTb usersTB)
        {
            try
            {
                using (var db = new drbContext())
                {

                    var founded = db.UserTb.FirstOrDefault(c => c.Id != usersTB.Id && (c.EmailAddress == usersTB.EmailAddress || c.Mobile == usersTB.Mobile));
                    if (founded != null)
                    {
                        return -2;
                    }

                    UserTb data = new UserTb();
                    using (var _db = new drbContext())
                    {
                        data = _db.UserTb.Find(usersTB.Id);
                    }
                    if (!string.IsNullOrWhiteSpace(usersTB.Password))
                    {
                        usersTB.Password = HelperDAL.HashMd5(usersTB.Password + tempKey);
                    }
                    else
                    {
                        usersTB.Password = data.Password;
                    }

                    db.Entry(usersTB).State = EntityState.Modified;
                    db.SaveChanges();
                    return usersTB.Id;
                }
            }
            catch (Exception)
            {
                return 0;//try again
            }
        }
        public static int DeleteUser(int id)
        {
            try
            {
                using (var db = new drbContext())
                {
                    var usersTB = db.UserTb.Find(id);
                    usersTB.IsDeleted = true;
                    db.Entry(usersTB).State = EntityState.Modified;
                    db.SaveChanges();
                    return usersTB.Id;
                }
            }
            catch (Exception)
            {
                return 0;
            }
        }

        public static List<GetAllUsers_Result> GetAllUsers(int pageNumber, int pageSize, string searchString, int? roleid, int? UnderSupervisor)
        {
            try
            {
                var db = new drbContext();
                return db.GetAllUsers_Result.FromSqlRaw("GetAllUsers {0}, {1}, {2}, {3}, {4}", searchString, roleid, UnderSupervisor, pageNumber, pageSize).AsEnumerable<GetAllUsers_Result>().ToList();
            }
            catch (Exception ex)
            {
                return new List<GetAllUsers_Result>();
            }
        }

        public static List<UserRulesTb> GetAllRules()
        {
            using (var db = new drbContext())
            {
                return db.UserRulesTb.ToList();
            }
        }
        public static UserTb GetuserByid(int id)
        {
            using (var db = new drbContext())
            {
                return db.UserTb.Include("Rule").FirstOrDefault(i => i.Id == id);
            }
        }
       
    }
}
