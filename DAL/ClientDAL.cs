using EF.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using VM;

namespace DAL
{
    public static class ClientDAL
    {
        public static string tempKey = "waSSDacVF%%*#026!df54145523dew^4dsd^fwef9fw#*&fgtrjO>dfdsfVdbfdc54Q8*q";
        public static int pr = 0;
        public static ClientViewModel AuthenticateClient(string Mobile, string Pass, string IP)
        {
            ClientViewModel model = new ClientViewModel();
            try
            {
                var db = new drbContext();
                var client = db.ClientTb.FirstOrDefault(c => (c.Mobile.Trim().ToLower() == Mobile.Trim().ToLower() || c.Email.Trim().ToLower() == Mobile.Trim().ToLower()) && c.IsDeleted != true);
                if (client != null)
                {
                    //save success login

                    if (client.Password == HelperDAL.HashMd5(Pass + tempKey))
                    {
                        model.UserId = 0;
                        model.UserMobile = "";
                        model.Email = "";
                        model.Pr = -1;
                        model.Name = "";
                        model.IsActive = client.IsActive;
                        model.IsBlocked = client.IsBlocked;
                        model.IsApproved = client.ConfirmedFromAdmin;
                        model.Lat = client.DriverCenterLat;
                        model.Lng = client.DriverCenterLng;
                        model.CircleKm = client.DriverCircleDistanceKm;
                        model.authKey = "";
                        model.AuthKey_ = client.Password;
                        model.Male = "";
                        model.Female = "";
                        model.Age = 0;
                        model.TypeIdFk = client.TypeIdFk;
                        model.IsCompleted = client.TypeIdFk == 1 ? (!string.IsNullOrWhiteSpace(client.MerchantCats) ? true : false) : (client.DriverCenterLat > 0 ? true : false);
                        if (client.IsActive)
                        {
                            if (!client.IsBlocked)
                            {
                                model.UserId = client.Id;
                                model.UserMobile = client.Mobile;
                                model.Email = client.Email;
                                model.Pr = pr;
                                model.Name = client.ClientName;
                                model.authKey = HelperDAL.HashMd5(client.Id.ToString() + pr.ToString() + tempKey + IP);
                                model.AuthKey_ = client.Password;
                                model.Age = client.Age;
                                model.TypeIdFk = client.TypeIdFk;
                                model.UserStatus = 1;//success login
                                return model;
                            }
                            else
                            {
                                model.UserStatus = -3;//blocked client
                                return model;
                            }
                        }
                        else
                        {
                            if (!client.IsBlocked)
                            {
                                model.UserId = client.Id;
                                model.UserMobile = client.Mobile;
                                model.Email = client.Email;
                                model.UserStatus = -2;//not active client
                                return model;
                            }
                            else
                            {
                                model.UserStatus = -3;//blocked client
                                return model;
                            }
                        }
                    }
                    else
                    {
                        model.UserStatus = -1;//error in pass
                        return model;
                    }
                }
                else
                {

                    //save failed login and block user or IP if needed

                    model.UserStatus = 0;//not found (error)
                    return model;
                }
            }
            catch (Exception ex)
            {
                model.UserStatus = 0;//not found (error)
                return model;
            }
        }
        public static ClientViewModel AutoAuthentication(string Mobile, string Pass, string IP)
        {
            ClientViewModel model = new ClientViewModel();
            try
            {
                var db = new drbContext();
                var client = db.ClientTb.FirstOrDefault(c => (c.Mobile.Trim().ToLower() == Mobile.Trim().ToLower() || c.Email.Trim().ToLower() == Mobile.Trim().ToLower()) && c.IsDeleted != true);
                if (client != null)
                {
                    if (client.Password == Pass)
                    {
                        model.UserId = 0;
                        model.UserMobile = "";
                        model.Email = "";
                        model.Pr = -1;
                        model.Name = "";
                        model.IsActive = client.IsActive;
                        model.IsBlocked = client.IsBlocked;
                        model.IsApproved = client.ConfirmedFromAdmin;
                        model.Lat = client.DriverCenterLat;
                        model.Lng = client.DriverCenterLng;
                        model.CircleKm = client.DriverCircleDistanceKm;
                        model.authKey = "";
                        model.Male = "";
                        model.Female = "";
                        model.Age = 0;
                        model.TypeIdFk = client.TypeIdFk;
                        model.IsCompleted = client.TypeIdFk == 1 ? (!string.IsNullOrWhiteSpace(client.MerchantCats) ? true : false) : (client.DriverCenterLat > 0 ? true : false);
                        if (client.IsActive)
                        {
                            if (!client.IsBlocked)
                            {
                                model.UserId = client.Id;
                                model.UserMobile = client.Mobile;
                                model.Email = client.Email;
                                model.Pr = pr;
                                model.Name = client.ClientName;
                                model.authKey = HelperDAL.HashMd5(client.Id.ToString() + pr.ToString() + tempKey + IP);
                                model.AuthKey_ = client.Password;
                                model.Age = client.Age;
                                model.TypeIdFk = client.TypeIdFk;

                                model.UserStatus = 1;//success login
                                return model;
                            }
                            else
                            {
                                model.UserStatus = -3;//blocked client
                                return model;
                            }
                        }
                        else
                        {
                            if (!client.IsBlocked)
                            {
                                model.UserId = client.Id;
                                model.UserMobile = client.Mobile;
                                model.Email = client.Email;
                                model.UserStatus = -2;//not active client
                                return model;
                            }
                            else
                            {
                                model.UserStatus = -3;//blocked client
                                return model;
                            }
                        }
                    }
                    else
                    {
                        model.UserStatus = -1;//error in pass
                        return model;
                    }
                }
                else
                {
                    model.UserStatus = 0;//not found (error)
                    return model;
                }
            }
            catch (Exception ex)
            {
                model.UserStatus = 0;//not found (error)
                return model;
            }
        }
        public static ClientViewModel SignupClient(ClientTb data, string IP)
        {
            ClientViewModel model = new ClientViewModel();
            try
            {
                drbContext db = new drbContext();
                var client = db.ClientTb.FirstOrDefault(c => (c.Mobile != null && c.Mobile.Trim().ToLower() == data.Mobile.Trim().ToLower()) || (c.Email != null && c.Email.Trim().ToLower() == data.Email.Trim().ToLower()));
                if (client == null)
                {
                    string randomeCode = HelperDAL.ReturenRandom();
                    //for debug only
                    randomeCode = "1234";
                    string msg = "كود التاكيد " + randomeCode + "";
                    string Res = HelperDAL.SendGetSMS(data.Mobile, "كود تأكيد رقم الجوال: " + randomeCode);
                    if (Res == "1")
                    {
                        client = new ClientTb()
                        {
                            ClientName = data.ClientName,
                            IsActive = false,
                            IsBlocked = false,
                            IsDeleted = false,
                            ConfirmedFromAdmin = false,
                            Email = data.Email,
                            Mobile = data.Mobile,
                            Password = HelperDAL.HashMd5(data.Password + tempKey),
                            ConfirmCode = randomeCode,
                            RegisterationDate = DateTime.Now,
                            TypeIdFk = data.TypeIdFk,
                            CityId = data.CityId,
                            ProfileImage = data.ProfileImage,
                            NotifyMe = true,
                            MerchantTypeId = data.MerchantTypeId,
                            MerchantMaroofUrl = data.MerchantMaroofUrl,
                            DriverCarColor = data.DriverCarColor,
                            DriverCarType = data.DriverCarType,
                            DriverCarNumber = data.DriverCarNumber,
                            DriverCarImage = data.DriverCarImage,
                            DriverCarFormImage = data.DriverCarFormImage,
                            DriverDrivingLicense = data.DriverDrivingLicense,
                            DriverNationalImage = data.DriverNationalImage,
                            DriverIdentityNumber = data.TypeIdFk == 2 ? "#" + HelperDAL.ReturenRandom() + data.Mobile.Substring(2) : null,

                        };
                        db.ClientTb.Add(client);
                        db.SaveChanges();
                        db.Entry(client).GetDatabaseValues();

                        model.UserId = 0;
                        model.UserMobile = "";
                        model.Email = "";
                        model.Pr = -1;
                        model.Name = "";
                        model.IsActive = client.IsActive;
                        model.IsBlocked = client.IsBlocked;
                        model.IsApproved = client.ConfirmedFromAdmin;
                        model.Lat = client.DriverCenterLat;
                        model.Lng = client.DriverCenterLng;
                        model.CircleKm = client.DriverCircleDistanceKm;
                        model.authKey = "";
                        model.UserStatus = 1; //success login
                        model.Male = "";
                        model.AuthKey_ = client.Password;
                        model.Female = "";
                        model.Age = 0;
                        model.TypeIdFk = client.TypeIdFk;
                        model.IsCompleted = client.TypeIdFk == 1 ? (!string.IsNullOrWhiteSpace(client.MerchantCats) ? true : false) : (client.DriverCenterLat > 0 ? true : false);

                        if (client.IsActive)
                        {
                            if (!client.IsBlocked)
                            {
                                model.UserId = client.Id;
                                model.UserMobile = client.Mobile;
                                model.Email = client.Email;
                                model.Pr = pr;
                                model.Name = client.ClientName;
                                model.authKey = HelperDAL.HashMd5(client.Id.ToString() + pr.ToString() + tempKey + IP);
                                model.AuthKey_ = client.Password;
                                model.Age = client.Age;
                                model.TypeIdFk = client.TypeIdFk;

                                //success login
                                return model;
                            }
                            else
                            {
                                //blocked client
                                return model;
                            }
                        }
                        else
                        {
                            if (!client.IsBlocked)
                            {
                                model.UserId = client.Id;
                                model.UserMobile = client.Mobile;
                                model.Email = client.Email;
                                model.TypeIdFk = client.TypeIdFk;
                                //not active client
                                return model;
                            }
                            else
                            {
                                //blocked client
                                return model;
                            }
                        }
                    }
                    else
                    {
                        model.UserStatus = -1;// sms not sent
                        return model;
                    }
                }
                else
                {
                    model.UserStatus = -2;//found (error)
                    return model;
                }
            }
            catch (Exception ex)
            {
                model.UserStatus = 0;//( network error)
                return model;
            }
        }
        public static void SaveRegLang(long client, string lng)
        {
            try
            {
                var db = new drbContext();
                var data = db.ClientTb.FirstOrDefault(c => c.Id == client);
                data.Lang = lng;
                db.SaveChanges();
            }
            catch (Exception ex)
            {
                //
            }
        }

        public static void SaveRegIdsWithLang(long client, string regid)
        {
            try
            {
                var db = new drbContext();
                var data = db.ClientTb.FirstOrDefault(c => c.Id == client);
                data.RegistrationId = regid;
                db.SaveChanges();
            }
            catch (Exception ex)
            {
                //
            }
        }

        public static long EditClient(ClientTb usersTB)
        {
            using (var db = new drbContext())
            {
                ClientTb data = new ClientTb();
                using (var _db = new drbContext())
                {
                    data = _db.ClientTb.Find(usersTB.Id);
                }
                if (!string.IsNullOrWhiteSpace(usersTB.Password))
                {
                    usersTB.Password = HelperDAL.HashMd5(usersTB.Password + tempKey);
                }
                else
                {
                    usersTB.Password = data.Password;
                }
                data.ClientName = usersTB.ClientName;
                data.Email = usersTB.Email;
                data.Mobile = usersTB.Mobile;
                data.Password = usersTB.Password;
                data.Age = usersTB.Age;
                db.Entry(data).State = EntityState.Modified;
                db.SaveChanges();
                return usersTB.Id;
            }
        }
        public static ClientViewModel EditAccount(ClientTb userEntity, string IP)
        {
            ClientViewModel model = new ClientViewModel();
            try
            {
                using (var db = new drbContext())
                {
                    var data = db.ClientTb.Find(userEntity.Id);
                    if (data.Id == userEntity.Id)
                    {
                        if (!string.IsNullOrWhiteSpace(userEntity.Mobile))
                        {
                            if (data.Mobile == userEntity.Mobile)
                            {
                                data.Mobile = userEntity.Mobile;
                                model.UserStatus = 1; //success
                            }
                            else
                            {
                                var checknewmobile = db.ClientTb.FirstOrDefault(i => i.Mobile.Trim().ToLower() == userEntity.Mobile.Trim().ToLower());
                                if (checknewmobile == null)
                                {
                                    data.Mobile = userEntity.Mobile;
                                    data.IsActive = false;
                                    string randomeCode = HelperDAL.ReturenRandom();
                                    //for debug only
                                    randomeCode = "1234";
                                    string msg = "كود التاكيد " + randomeCode + "";
                                    string Res = HelperDAL.SendGetSMS(data.Mobile, msg);

                                    if (Res == "1")
                                    {
                                        data.ConfirmCode = randomeCode;
                                        userEntity = null;
                                        db.SaveChanges();
                                        model.UserStatus = 1; //success   
                                    }
                                    else
                                    {
                                        model.UserStatus = -223; //error sms not sent
                                    }
                                }
                                else
                                {
                                    model.UserStatus = -23; //error emailfounded
                                }
                            }
                        }
                        else if (!string.IsNullOrWhiteSpace(userEntity.Email))
                        {
                            if (data.Email == userEntity.Email)
                            {
                                data.Email = userEntity.Email;
                                model.UserStatus = 1; //success
                            }
                            else
                            {
                                var checknewmobile = db.ClientTb.FirstOrDefault(i => i.Email.Trim().ToLower() == userEntity.Email.Trim().ToLower());
                                if (checknewmobile == null)
                                {
                                    data.Email = userEntity.Email;
                                    data.IsActive = false;
                                    string randomeCode = HelperDAL.ReturenRandom();
                                    //for debug only
                                    randomeCode = "1234";
                                    string msg = "كود التاكيد " + randomeCode + "";
                                    string Res = HelperDAL.SendGetSMS(data.Mobile, msg);

                                    if (Res == "1")
                                    {
                                        data.ConfirmCode = randomeCode;
                                        userEntity = null;
                                        db.SaveChanges();
                                        model.UserStatus = 1; //success   
                                    }
                                    else
                                    {
                                        model.UserStatus = -22; //error sms not sent
                                    }
                                }
                                else
                                {
                                    model.UserStatus = -2; //error emailfounded
                                }
                            }
                        }
                        else if (!string.IsNullOrWhiteSpace(userEntity.ClientName))
                        {
                            data.ClientName = userEntity.ClientName;
                            userEntity = null;
                            db.SaveChanges();
                            model.UserStatus = 1; //success
                        }
                        else if (userEntity.Age != null)
                        {
                            data.Age = userEntity.Age;
                            userEntity = null;
                            db.SaveChanges();
                            model.UserStatus = 1; //success
                        }
                        else if (!string.IsNullOrWhiteSpace(userEntity.PasswordNe) && !string.IsNullOrWhiteSpace(userEntity.Password))
                        {
                            if (data.Password == HelperDAL.HashMd5(userEntity.Password + tempKey))
                            {
                                data.Password = HelperDAL.HashMd5(userEntity.PasswordNe + tempKey);
                                userEntity = null;
                                db.SaveChanges();
                                model.UserStatus = 1; //success
                            }
                            else
                                model.UserStatus = -3;//password error
                        }
                        else
                        {
                            model.UserStatus = -4; //nothing to do (check you enter data)
                        }
                        model.UserId = 0;
                        model.UserMobile = "";
                        model.Email = "";
                        model.Pr = -1;
                        model.Name = "";
                        model.IsActive = data.IsActive;
                        model.IsBlocked = data.IsBlocked;
                        model.IsApproved = data.ConfirmedFromAdmin;
                        model.Lat = data.DriverCenterLat;
                        model.Lng = data.DriverCenterLng;
                        model.CircleKm = data.DriverCircleDistanceKm;
                        model.authKey = "";
                        model.Male = "";
                        model.AuthKey_ = data.Password;
                        model.Female = "";
                        model.Age = 0;
                        model.TypeIdFk = data.TypeIdFk;
                        model.IsCompleted = data.TypeIdFk == 1 ? (!string.IsNullOrWhiteSpace(data.MerchantCats) ? true : false) : (data.DriverCenterLat > 0 ? true : false);

                        if (data.IsActive)
                        {
                            if (!data.IsBlocked)
                            {
                                model.UserId = data.Id;
                                model.UserMobile = data.Mobile;
                                model.Email = data.Email;
                                model.Pr = pr;
                                model.AuthKey_ = data.Password;
                                model.Name = data.ClientName;
                                model.authKey = HelperDAL.HashMd5(data.Id.ToString() + pr.ToString() + tempKey + IP);
                                model.Age = data.Age;
                                model.TypeIdFk = data.TypeIdFk;

                                //success login
                                return model;
                            }
                            else
                            {
                                //blocked client
                                return model;
                            }
                        }
                        else
                        {
                            if (!data.IsBlocked)
                            {
                                model.UserId = data.Id;
                                model.UserMobile = data.Mobile;
                                model.Email = data.Email;
                                //not active client
                                return model;
                            }
                            else
                            {
                                //blocked client
                                return model;
                            }
                        }
                    }
                    else
                    {
                        model.UserStatus = -5; //not found user (logout and redirect to log sin)
                    }
                    return model;
                }
            }
            catch (Exception)
            {
                model.UserStatus = 0; //network error
                return model;
            }
        }
        public static bool CheckCode(string mobile, string textCode)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(mobile))
                {
                    var db = new drbContext();
                    var userdata = db.ClientTb.FirstOrDefault(i => i.Email.ToLower() == mobile.ToLower());
                    if (userdata != null && userdata.ConfirmCode.Trim() == textCode.Trim())
                    {
                        userdata.IsActive = true;
                        userdata.ConfirmCode = null;
                        db.ClientTb.Attach(userdata);
                        db.Entry(userdata).State = EntityState.Modified;
                        db.SaveChanges();
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                    return false;
                }
            }
            catch (Exception)
            {
                return false;
            }

        }
        public static bool ChangePass(string mobile, string password, string textCode)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(mobile))
                {
                    var db = new drbContext();
                    var userdata = db.ClientTb.FirstOrDefault(i => i.Mobile.ToLower() == mobile.ToLower());
                    if (userdata != null && userdata.ConfirmCode.Trim() == textCode.Trim())
                    {
                        userdata.Password = password;
                        userdata.ConfirmCode = null;
                        db.ClientTb.Attach(userdata);
                        db.Entry(userdata).State = EntityState.Modified;
                        db.SaveChanges();
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                    return false;
                }
            }
            catch (Exception)
            {
                return false;
            }

        }
        public static bool ChangePassword(string mobile, string pass)
        {
            try
            {
                using (var _db = new drbContext())
                {
                    var accounttb = _db.ClientTb.FirstOrDefault(i => i.Mobile.Trim().ToLower() == mobile.Trim().ToLower());
                    if (accounttb != null)
                    {
                        accounttb.Password = pass;
                        _db.Entry(accounttb).State = EntityState.Modified;
                        _db.SaveChanges();
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
            }
            catch (Exception)
            {
                return false;
            }
        }
        public static bool ForgotPassword(string mobile)
        {
            try
            {
                using (var _db = new drbContext())
                {
                    var accounttb = _db.ClientTb.FirstOrDefault(i => i.Email.Trim().ToLower() == mobile.Trim().ToLower());
                    if (accounttb != null)
                    {
                        string randomeCode = HelperDAL.ReturenRandom();
                        //for debug only
                        randomeCode = "1234";
                        string msg = "كود التاكيد " + randomeCode + "";
                        //string Res = HelperDAL.SendGetSMS(mobile, msg);
                        string Res = HelperDAL.SendGetSMS(accounttb.Mobile, msg);
                        accounttb.ConfirmCode = randomeCode;
                        _db.SaveChanges();
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
            }
            catch (Exception)
            {
                return false;
            }
        }

        public static bool ResetMyLoginData(string mobile)
        {
            try
            {
                using (var _db = new drbContext())
                {
                    var accounttb = _db.ClientTb.FirstOrDefault(i => i.Mobile.Trim().ToLower() == mobile.Trim().ToLower());
                    if (accounttb != null)
                    {
                        string randomeCode = HelperDAL.ReturenRandom();
                        //for debug only
                        randomeCode = "1234";
                        string msg = "كود التاكيد " + randomeCode + "";
                        //string Res = HelperDAL.SendGetSMS(mobile, msg);
                        string Res = HelperDAL.SendGetSMS(accounttb.Mobile, "كلمة المرور الجديدة: " + randomeCode);
                        accounttb.Password = HelperDAL.HashMd5(randomeCode + tempKey);
                        _db.SaveChanges();
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
            }
            catch (Exception)
            {
                return false;
            }
        }
        public static bool SendNewCode(int id, string mobile)
        {
            try
            {
                using (var _db = new drbContext())
                {
                    var accounttb = _db.ClientTb.FirstOrDefault(i => i.Id == id);
                    if (accounttb != null)
                    {
                        string randomeCode = HelperDAL.ReturenRandom();
                        //for debug only
                        randomeCode = "1234";
                        string msg = "كود التاكيد " + randomeCode + "";
                        //string Res = HelperDAL.SendGetSMS(mobile, msg);
                        string Res = HelperDAL.SendGetSMS(accounttb.Mobile, msg);
                        accounttb.ConfirmCode = randomeCode;
                        _db.SaveChanges();
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
            }
            catch (Exception)
            {
                return false;
            }
        }
        public static bool CheckConfirmCode(int id, string code)
        {
            try
            {
                using (var _db = new drbContext())
                {
                    var accounttb = _db.ClientTb.FirstOrDefault(i => i.Id == id);
                    if (accounttb != null)
                    {
                        if (accounttb.ConfirmCode == code)
                        {
                            return true;
                        }
                        else
                        {
                            return false;
                        }

                    }
                    else
                    {
                        return false;
                    }
                }
            }
            catch (Exception)
            {
                return false;
            }
        }
        public static List<GetAllClients_Result> GetAllClients(int pageNumber, int pageSize, string searchString, long? Id, byte typeId, bool? confirmed)
        {
            try
            {
                var db = new drbContext();
                return db.GetAllClients_Result.FromSqlRaw("GetAllClients {0}, {1}, {2}, {3}, {4}, {5}", Id, typeId, searchString, confirmed, pageNumber, pageSize).AsEnumerable<GetAllClients_Result>().ToList();
            }
            catch (Exception ex)
            {
                return new List<GetAllClients_Result>();
            }
        }

        public static ClientTb GetClientByid(long id)
        {
            using (var db = new drbContext())
            {
                return db.ClientTb.Find(id);
            }
        }
        public static long DeleteClient(long id)
        {
            using (var db = new drbContext())
            {
                try
                {
                    var data = db.ClientTb.Find(id);
                    data.Mobile = data.Mobile + "Deleted" + data.Id;
                    data.Email = data.Email + "Deleted" + data.Id;
                    data.IsActive = false;
                    data.IsBlocked = true;
                    data.IsDeleted = true;
                    db.Entry(data).State = EntityState.Modified;
                    db.SaveChanges();
                    return id;
                }
                catch (Exception ex)
                {
                    return 0;
                }
            }
        }
        public static long ManageClientBlock(long id, bool blocked)
        {
            using (var db = new drbContext())
            {
                try
                {
                    var data = db.ClientTb.Find(id);
                    data.IsBlocked = blocked;
                    data.IsActive = !blocked;
                    db.Entry(data).State = EntityState.Modified;
                    db.SaveChanges();
                    return id;
                }
                catch (Exception ex)
                {
                    return 0;
                }
            }
        }

        public static long ManageClientApprovementFromAdmin(long id, bool approved)
        {
            using (var db = new drbContext())
            {
                try
                {
                    var data = db.ClientTb.Find(id);
                    data.ConfirmedFromAdmin = approved;
                    db.Entry(data).State = EntityState.Modified;
                    db.SaveChanges();
                    return id;
                }
                catch (Exception ex)
                {
                    return 0;
                }
            }
        }

    }
}
