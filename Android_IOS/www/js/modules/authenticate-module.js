
$$(document).on("page:afterin", '.page[data-name="signup"]', function () {
    app.methods.GetAllCitiesCachedBeforeSign();
});

//sign up
$$(document).on("click", ".SignupBtn", function () {

    var ClientMobile = $$(mainView.router.currentPageEl).find(".ClientMobileInput").val();
    var ClientPassword = $$(mainView.router.currentPageEl).find(".PasswordNeSign").val();
    var ClientPasswordRe = $$(mainView.router.currentPageEl).find(".PasswordNeSignRe").val();
    var ClientEmail = $$(mainView.router.currentPageEl).find(".Email").val();
    var FullName = $$(mainView.router.currentPageEl).find(".FullName").val();
    var SelectedCity = $$(mainView.router.currentPageEl).find(".SelectedCity").val();
    var profilemage = $$(mainView.router.currentPageEl).find("#profilemage").attr("src");


    var RegType = $$(mainView.router.currentPageEl).find(".RegType.active").attr("name");

    //merchant
    var MerchantTypeId = $$(mainView.router.currentPageEl).find(".MerchantTypeId").val();
    var MaroofUrlOrNumber = $$(mainView.router.currentPageEl).find(".MaroofUrlOrNumber").val();

    //driver
    var CarType = $$(mainView.router.currentPageEl).find(".CarType").val();
    var CarColor = $$(mainView.router.currentPageEl).find(".CarColor").val();
    var CarNumber = $$(mainView.router.currentPageEl).find(".CarNumber").val();
    var DrivingLicenseImage = $$(mainView.router.currentPageEl).find("#DrivingLicenseImage").attr("src");
    var CarImage = $$(mainView.router.currentPageEl).find("#CarImage").attr("src");
    var DrivingNationalityImage = $$(mainView.router.currentPageEl).find("#DrivingNationalityImage").attr("src");
    var CarFormImage = $$(mainView.router.currentPageEl).find("#CarFormImage").attr("src");

    //for testing only
    profilemage = "/Areas/avatar.png";
    DrivingLicenseImage = "/Areas/avatar.png";
    CarImage = "/Areas/avatar.png";
    DrivingNationalityImage = "/Areas/avatar.png";
    CarFormImage = "/Areas/avatar.png";


    if (ClientMobile.trim() != "" && ClientPassword.trim() != "" && ClientPasswordRe.trim() != "" && ClientEmail.trim() != "" && FullName.trim() != "" && SelectedCity != "0" && profilemage != "img/avatar.png" &&
        ((RegType == "1" && MerchantTypeId != "0" && MaroofUrlOrNumber.trim() != "") ||
            (RegType == "2" && CarType.trim() != "" && CarNumber.trim() != "" && CarColor.trim() != "" && DrivingLicenseImage != "img/avatar.png" && DrivingNationalityImage != "img/avatar.png" && CarImage != "img/avatar.png" && CarFormImage != "img/avatar.png"))
    ) {
        if (ClientPassword.trim() != ClientPasswordRe.trim()) {
            app.methods.AlertConfirmPassError();
            return;
        }
        chkvalidphone();
        if (validPhone) {

            if ($$(mainView.router.currentPageEl).find("#agreement").prop("checked") != true) {
                app.methods.AlertAgreeOnTermsError();
                return;
            }

            var data = {
                Mobile: ClientMobile,
                ClientName: ClientEmail,
                Email: ClientEmail,
                Password: ClientPassword,
                ClientName: FullName,
                TypeIdFK: RegType,
                CityId: SelectedCity,
                ProfileImage: profilemage,
            };
            if (RegType == "1") {
                data.MerchantTypeId = MerchantTypeId;
                data.MerchantMaroofURL = MaroofUrlOrNumber;
            }
            else {
                data.DriverCarType = CarType;
                data.DriverCarColor = CarColor;
                data.DriverCarNumber = CarNumber;
                data.DriverCarImage = CarImage;
                data.DriverCarFormImage = CarFormImage;
                data.DriverNationalImage = DrivingNationalityImage;
                data.DriverDrivingLicense = DrivingLicenseImage;
            }

            app.preloader.show();
            var q = "" + app.data.hosting.ApiUrl + "/Account/SignUp";
            console.log(q);
            app.request.post(q, data, function (e) {
                e = JSON.parse(e);
                app.preloader.hide();
                if (e.userStatus != 0 && e.userStatus != -1 && e.userStatus != -2 && e.userStatus == 1) {//save credintial and redirect to Home page
                    localStorage.ClientCredintial = JSON.stringify(e);
                    localStorage.loginMobile = e.userMobile;
                    localStorage.token = e.authKey_;
                    if ("" + e.typeIdFk != RegType) {
                        localStorage.removeItem("ClientCredintial");
                        localStorage.removeItem("loginMobile");
                        localStorage.removeItem("loginPassword");
                        //inform client that he is blocked
                        var toastBottom = app.toast.create({
                            text: localStorage.lang == "en" ? 'You should login now' : 'ينبغى تسجيل دخولك للتطبيق',
                            closeTimeout: 2000
                        });
                        toastBottom.open();
                        app.methods.GoToLoginPage();
                    }
                    if (e.isBlocked) {
                        //remove credintials
                        localStorage.removeItem("ClientCredintial");
                        localStorage.removeItem("loginMobile");
                        localStorage.removeItem("loginPassword");
                        //inform client that he is blocked
                        if (localStorage.lang == "en") {
                            var toastBottom = app.toast.create({
                                text: 'Your account is blocked',
                                closeTimeout: 2000
                            });
                            toastBottom.open();
                        }
                        else {
                            var toastBottom = app.toast.create({
                                text: 'تم حظرك من  دخول التطبيق',
                                closeTimeout: 2000
                            });
                            toastBottom.open();
                        }
                    }
                    else if (!e.isActive) {
                        //redirect to confirm code page
                        app.methods.GoToConfirmPage(e.userMobile);
                    }
                    else {
                        if (!e.isApproved || !e.isCompleted) {
                            app.methods.GoToWaitingApprovePage();
                        }
                        else {
                            //go to home page
                            //$$(".user-login-name").html(e.name);
                            mainView.router.navigate({ name: 'index' }, { clearPreviousHistory: true });
                        }
                    }
                }
                if (e.userStatus == 0 || e.userStatus == -1) {
                    app.methods.AlertTryAgainError();
                }
                if (e.userStatus == -2) {
                    //founded >> route to login page
                    //inform client that account repeated
                    if (localStorage.lang == "en") {
                        var toastBottom = app.toast.create({
                            text: 'Error, this account is already exist!',
                            closeTimeout: 2000
                        });
                        toastBottom.open();
                    }
                    else {
                        var toastBottom = app.toast.create({
                            text: 'عذرًا , هذا الحساب مستخدم مسبقًا !',
                            closeTimeout: 2000
                        });
                        toastBottom.open();
                    }
                    //mainView.router.navigate({ name: 'login' }, {});
                }
            }, function (error) {
                app.preloader.hide();
            });
        }
        else {
            app.methods.AlertWrongPhoneNumber();
        }
    }
    else {
        app.methods.AlertMissingFields();
    }
});
$$(document).on("keyup", ".ClientMobileInput", function (e) {
    var strx = $$(this).val();
    var n = strx.search(/05/i);
    if (n == 0 && strx.length == 10 && (hasWhiteSpace(strx) == false) && isAllNum(strx)) {
        validPhone = true;
        $$(this).css("border-color", "green");
    }
    else {
        validPhone = false;
        $$(this).css("border-color", "red");
    }
});
//login
$$(document).on("click", ".LoginBtn", function () {
    var ClientMobile = $$(mainView.router.currentPageEl).find(".MobileNumber").val();
    var ClientPassword = $$(mainView.router.currentPageEl).find(".Password").val();
    if (ClientMobile.trim() != "" && ClientPassword.trim() != "") {
        app.preloader.show();

        var data = {
            Mobile: ClientMobile,
            Password: ClientPassword
        };

        var q = "" + app.data.hosting.ApiUrl + "/Account/Authenticate";
        app.request.post(q, data, function (e) {
            e = JSON.parse(e);
            app.preloader.hide();
            if (e.userStatus != 0 && e.userStatus != -1 && e.userStatus != -2 && e.userStatus != -3 && e.userStatus == 1 && !e.isBlocked && e.isActive) {//save credintial and redirect to home page
                localStorage.ClientCredintial = JSON.stringify(e);
                localStorage.loginMobile = e.userMobile;
                localStorage.token = e.authKey_;

                app.methods.SetupAjaxRequestHeader();

                setTimeout(function () {
                    app.methods.OrganizeLayoutBasedOnCredintial();
                    try { app.methods.HandleNotifications(e.userId); } catch (eccc) { }
                    app.methods.GetAllGetSetupDataCached();
                }, 500);

                if (localStorage.lang == "en") {
                    var toastBottom = app.toast.create({
                        text: 'Welcome in drb',
                        closeTimeout: 2000
                    });
                    toastBottom.open();
                }
                else {
                    var toastBottom = app.toast.create({
                        text: 'مرحباً بك فى درب',
                        closeTimeout: 2000
                    });
                    toastBottom.open();
                }
                sessionStorage.loadhomewithuserid = "1";
                //$$(".user-login-name").html(e.name);
                localStorage.homechoose = true;
                if (!e.isApproved || !e.isCompleted) {
                    app.methods.GoToWaitingApprovePage();
                }
                else {
                    //mainView.router.navigate({ name: 'index' }, {
                    //    reloadCurrent: true,
                    //    ignoreCache: true,
                    //});
                    mainView.router.navigate(
                        {
                            name: 'index'
                        },
                        {
                            transition: 'f7-circle',
                        });
                }
            }
            else if (e.userStatus == 0 || e.userStatus == -1) {
                app.methods.AlertLoginError();
            }
            else if (e.userStatus == -2) {
                localStorage.ClientCredintial = JSON.stringify(e);
                localStorage.loginMobile = e.userMobile;
                localStorage.token = e.authKey_;
                //redirect to confirm code page
                app.methods.GoToConfirmPage(e.userMobile);
            }
            else if (e.userStatus == -3) {
                //remove credintials
                localStorage.removeItem("ClientCredintial");
                localStorage.removeItem("loginMobile");
                localStorage.removeItem("loginPassword");
                //inform client that he is blocked
                if (localStorage.lang == "en") {
                    var toastBottom = app.toast.create({
                        text: 'Your account is blocked',
                        closeTimeout: 2000
                    });
                    toastBottom.open();
                }
                else {
                    var toastBottom = app.toast.create({
                        text: 'تم حظرك من  دخول التطبيق',
                        closeTimeout: 2000
                    });
                    toastBottom.open();
                }
            }
        }, function (error) {
            app.preloader.hide();
            var toastBottom = app.toast.create({
                text: localStorage.lang == "en" ? 'Try again later' : 'حاول مجدداً لاحقاً',
                closeTimeout: 2000
            });
            toastBottom.open();
        });
    }
});
//bind mobile in confirm >> to change it if require
$$(document).on("page:afterin", '.page[data-name="confirm"]', function () {
    if (localStorage.loginMobile) {
        $$(".MobileNumber").val(localStorage.loginMobile);
        $$(".MobileNumber").attr("disabled", "disabled");
    }
    app.input.focus($$(mainView.router.currentPageEl).find("#Code1"));
    document.getElementById("Code1").focus();
    $$(mainView.router.currentPageEl).find("#Code1").focus();
});
//confirm code from (confirm page)
function ConfirmCode() {
    var cr = JSON.parse(localStorage.ClientCredintial);
    var ClientMobile = cr.email;
    var Code1 = $$(mainView.router.currentPageEl).find("#Code1").val();
    var Code2 = $$(mainView.router.currentPageEl).find("#Code2").val();
    var Code3 = $$(mainView.router.currentPageEl).find("#Code3").val();
    var Code4 = $$(mainView.router.currentPageEl).find("#Code4").val();
    if (ClientMobile.trim() != "" && Code1.trim() != "" && Code2.trim() != "" && Code3.trim() != "" && Code4.trim() != "") {
        var Code = "" + Code1.trim() + "" + Code2.trim() + "" + Code3.trim() + "" + Code4.trim();
        app.preloader.show();
        var data =
        {
            Mobile: ClientMobile,
            ConfirmCode: Code
        };
        var q = "" + app.data.hosting.ApiUrl + "/Account/CheckCode";
        app.request.post(q, data, function (e) {
            e = JSON.parse(e);
            app.preloader.hide();
            if (e == true) {
                app.methods.AutomaticAuthenticateAfterConfirmation();
            }
            else {
                app.methods.AlertTryAgainError();
                $$(mainView.router.currentPageEl).find("#Code1").val('');
                $$(mainView.router.currentPageEl).find("#Code2").val('');
                $$(mainView.router.currentPageEl).find("#Code3").val('');
                $$(mainView.router.currentPageEl).find("#Code4").val('');

                app.input.focus($$(mainView.router.currentPageEl).find("#Code1"));
                document.getElementById("Code1").focus();
            }
        }, function (error) {
            app.preloader.hide();
        });
    }
    else {
        app.methods.AlertMissingFields();
    }
}
$$(document).on("click", ".CheckCodeBtn", function () {
    ConfirmCode();
});
function moveOnMax(field, nextFieldID) {
    if (field.value.length >= field.maxLength) {
        if (nextFieldID == "Code5") {
            ConfirmCode();
        }
        else {
            app.input.focus($$(mainView.router.currentPageEl).find("#" + nextFieldID));
            document.getElementById(nextFieldID).focus();
            $$(mainView.router.currentPageEl).find("#" + nextFieldID).focus();
        }
    }
}
//forget password
$$(document).on("click", ".sendForgetMsg", function () {
    var ClientMobile = $$(mainView.router.currentPageEl).find(".emailtouse").val();
    if (ClientMobile.trim() != "") {
        app.preloader.show();
        var q = "" + app.data.hosting.ApiUrl + "/Account/ResetMyLoginData?mobile=" + ClientMobile;
        app.request.get(q, function (e) {
            e = JSON.parse(e);
            app.preloader.hide();
            if (e == true) {
                if (localStorage.lang == "en") {
                    var toastBottom = app.toast.create({
                        text: 'Password has been sent to your phone',
                        closeTimeout: 2000
                    });
                    toastBottom.open();
                }
                else {
                    var toastBottom = app.toast.create({
                        text: 'تم ارسال كلمة المرور إلى جوالك',
                        closeTimeout: 2000
                    });
                    toastBottom.open();
                }
                mainView.router.back();
            }
            else {
                app.methods.AlertTryAgainError();
            }
        }, function (error) {
            app.preloader.hide();
        });
    }
    else {
        app.methods.AlertMissingMobileForReset();
    }
});
//send confirm code again from (confirm page)
$$(document).on("click", ".SendCodeAgainBtn", function () {
    var cr = JSON.parse(localStorage.ClientCredintial);
    var ClientMobile = cr.email;
    if (ClientMobile.trim() != "") {
        app.preloader.show();
        var q = "" + app.data.hosting.ApiUrl + "/Account/ForgetPassword?mobile=" + ClientMobile;
        app.request.get(q, function (e) {
            e = JSON.parse(e);
            app.preloader.hide();
            if (e == true) {
                if (localStorage.lang == "en") {
                    var toastBottom = app.toast.create({
                        text: 'Confirmation code has been sent to your phone',
                        closeTimeout: 2000
                    });
                    toastBottom.open();
                }
                else {
                    var toastBottom = app.toast.create({
                        text: 'تم ارسال كود التأكيد إلى جوالك',
                        closeTimeout: 2000
                    });
                    toastBottom.open();
                }
                app.input.focus($$(mainView.router.currentPageEl).find("#Code1"));
                document.getElementById("Code1").focus();
                $$(mainView.router.currentPageEl).find("#Code1").focus();
            }
            else {
                app.methods.AlertTryAgainError();
            }
        }, function (error) {
            app.preloader.hide();
        });
    }
    else {
        mainView.router.navigate({ name: 'forgetpassword' }, {});
    }
});
//logout
$$(document).on("click", ".LogoutLinkBtn", function () {
    localStorage.removeItem("ClientCredintial");
    localStorage.removeItem("loginMobile");
    localStorage.removeItem("loginPassword");
    app.methods.OrganizeLayoutBasedOnCredintial();

    //go to home page
    sessionStorage.loadhomewithuserid = "1";
    mainView.router.navigate({ name: 'index' }, {
        reloadAll: true,
        clearPreviousHistory: true,
        reloadCurrent: true,
        ignoreCache: true,
    });
});
//edit profile - change password 
$$(document).on("click", ".EditChangePassword", function () {
    var userid = 0;
    if (localStorage.ClientCredintial) {
        var cr = JSON.parse(localStorage.ClientCredintial);
        if (cr.isActive == true)
            userid = cr.userId;
    }
    if (userid == 0) {
        app.methods.GoToSignupPage();
    }
    else {
        var oldpass = $$(mainView.router.currentPageEl).find(".editpassold").val();
        var newpass = $$(mainView.router.currentPageEl).find(".editpassnew").val();
        if (oldpass.trim() != "" && newpass.trim() != "") {
            EditAccountData(id = userid, mobile = null, password = oldpass, email = null, name = null, passwordNe = newpass, notifyManager = null, notifyOffers = null, age = null, gender = null);
        }
        else {
            if (localStorage.lang == "en") {
                var toastBottom = app.toast.create({
                    text: 'Check that you fill current and new password',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else {
                var toastBottom = app.toast.create({
                    text: 'الرجاء التحقق من تعبئة كلمة المرور الحالية والجديدة',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
        }
    }
});
//edit profile or from mobile confirm  - change phone
$$(document).on("click", ".mobilesaveedit", function () {
    var userid = 0;
    if (localStorage.ClientCredintial) {
        var cr = JSON.parse(localStorage.ClientCredintial);
        userid = cr.userId;
    }
    if (userid == 0) {
        app.methods.GoToSignupPage();
    }
    else {
        var mob = $$(mainView.router.currentPageEl).find(".ClientMobileInput").val();
        if (mob.trim() != "") {
            chkvalidphone();
            if (validPhone) {
                EditAccountData(id = userid, mobile = mob, password = null, email = null, name = null, passwordNe = null, notifyManager = null, notifyOffers = null, age = null, gender = null);
            }
            else {
                app.methods.AlertWrongPhoneNumber();
            }
        }
        else {
            if (localStorage.lang == "en") {
                var toastBottom = app.toast.create({
                    text: 'Error, Check that you fill phone',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else {
                var toastBottom = app.toast.create({
                    text: 'الرجاء التحقق من تعبئة رقم الجوال',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
        }
    }
});

//function to edit profile
function EditAccountData(id, mobile, password, email, name, passwordNe, notifyManager, notifyOffers, age, gender) {
    var completeuripara = "";
    if (id != null)
        completeuripara = "";
    if (mobile != null)
        completeuripara += "mobile=" + mobile;
    if (password != null)
        completeuripara += "&password=" + password;
    if (email != null)
        completeuripara += "&email=" + email;
    if (name != null)
        completeuripara += "&name=" + name;
    if (passwordNe != null)
        completeuripara += "&passwordNe=" + passwordNe;
    if (notifyManager != null)
        completeuripara += "&notifyManager=" + notifyManager;
    if (notifyOffers != null)
        completeuripara += "&notifyOffers=" + notifyOffers;
    if (age != null)
        completeuripara += "&age=" + age;
    if (gender != null)
        completeuripara += "&gender=" + gender;

    var data = {
        Mobile: mobile,
        ClientName: name,
        Email: email,
        Password: password,
        PasswordNe: passwordNe,
        Age: age,
        GenderIdFk: gender
    };

    app.preloader.show();
    var q = "" + app.data.hosting.ApiUrl + "/Account/EditAccount";
    app.methods.MakaAjaxCall(q, "POST", data, function (e) {
        e = JSON.parse(e);
        app.preloader.hide();
        if (e.userStatus == 1) {//save credintial and redirect to home page
            localStorage.ClientCredintial = JSON.stringify(e);
            if (mobile != null) {
                localStorage.loginMobile = mobile;
            }
            else if (passwordNe != null) {
                localStorage.token = e.authKey_;
                $$(mainView.router.currentPageEl).find(".editpassold").val('');
                $$(mainView.router.currentPageEl).find(".editpassnew").val('');
            }
            else if (email != null) {
                $$(mainView.router.currentPageEl).find(".oldemailedit").val('');
                $$(mainView.router.currentPageEl).find(".newemailedit").val('');
            }
            app.methods.SetupAjaxRequestHeader();

            if (e.isActive == true) {
                if (localStorage.lang == "en") {
                    var toastBottom = app.toast.create({
                        text: 'Saved Successfully',
                        closeTimeout: 2000
                    });
                    toastBottom.open();
                }
                else {
                    var toastBottom = app.toast.create({
                        text: 'تم الحفظ بنجاح',
                        closeTimeout: 2000
                    });
                    toastBottom.open();
                }
            }
            else {
                if (mobile != null) {
                    if (localStorage.lang == "en") {
                        var toastBottom = app.toast.create({
                            text: 'Saved Successfully, but you need to confirm Mobile change',
                            closeTimeout: 2000
                        });
                        toastBottom.open();
                    }
                    else {
                        var toastBottom = app.toast.create({
                            text: 'تم الحفظ بنجاح, ينبغي تأكيد تغيير رقم الهاتف',
                            closeTimeout: 2000
                        });
                        toastBottom.open();
                    }
                    //redirect to confirm code page
                    app.methods.GoToConfirmPageAfterChangeMobile(mobile);
                }
                else {
                    if (localStorage.lang == "en") {
                        var toastBottom = app.toast.create({
                            text: 'Saved Successfully, but you need to confirm email change',
                            closeTimeout: 2000
                        });
                        toastBottom.open();
                    }
                    else {
                        var toastBottom = app.toast.create({
                            text: 'تم الحفظ بنجاح, ينبغي تأكيد تغيير البريد الإلكتروني',
                            closeTimeout: 2000
                        });
                        toastBottom.open();
                    }
                    app.methods.GoToConfirmPageAfterChangeEmail();
                }
            }
        }
        else if (e.userStatus == -1) {
            if (localStorage.lang == "en") {
                var toastBottom = app.toast.create({
                    text: 'Error, Phone is used before',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else {
                var toastBottom = app.toast.create({
                    text: 'خطأ, رقم الجوال مستخدم من قبل',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
        }
        else if (e.userStatus == -2) {
            if (localStorage.lang == "en") {
                var toastBottom = app.toast.create({
                    text: 'Error, Email is used before',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else {
                var toastBottom = app.toast.create({
                    text: 'خطأ, البريد الإلكتروني مستخدم من قبل',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
        }
        else if (e.userStatus == -23) {
            if (localStorage.lang == "en") {
                var toastBottom = app.toast.create({
                    text: 'Error, Mobile is used before',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else {
                var toastBottom = app.toast.create({
                    text: 'خطأ, رقم الهاتف مستخدم من قبل',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
        }
        else if (e.userStatus == -3) {
            if (localStorage.lang == "en") {
                var toastBottom = app.toast.create({
                    text: 'Error, Current password is wrong',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else {
                var toastBottom = app.toast.create({
                    text: 'خطأ, كلمة المرور الحالية خاطئة',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
        }
        else if (e.userStatus == -4) {
            if (localStorage.lang == "en") {
                var toastBottom = app.toast.create({
                    text: 'Error, Check that you make any changes',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else {
                var toastBottom = app.toast.create({
                    text: 'خطأ, الرجاء التحقق من قيامك بالتعديل',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
        }
        else if (e.userStatus == -5) {
            if (localStorage.lang == "en") {
                var toastBottom = app.toast.create({
                    text: 'Error, Your account is not found',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else {
                var toastBottom = app.toast.create({
                    text: 'خطأ, حسابك غير موجود',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
        }
        else {
            if (localStorage.lang == "en") {
                var toastBottom = app.toast.create({
                    text: 'Error, Try again later',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else {
                var toastBottom = app.toast.create({
                    text: 'خطأ, حاول مرة أخري لاحقاً',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
        }
    }, function (error) {
        app.preloader.hide();
    });
}

