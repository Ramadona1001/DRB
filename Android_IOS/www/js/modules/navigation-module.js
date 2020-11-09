//Change Language from intro sliders
$$(document).on("click", ".changeLang-fstTime", function () {

    if (localStorage.lang == "en") {
        localStorage.lang = "ar";
        $$("#arabic-style").attr("href", "");
        $$("#arabic-framework").attr("href", "css/framework7.bundle.rtl.min.css");
        app.rtl = true;
        app.methods.ChangeLangFromDataAttr();

    }
    else {
        localStorage.lang = "en";
        $$("#arabic-style").attr("href", "css/style-ltr.css");
        $$("#arabic-framework").attr("href", "");
        app.rtl = false;
        app.methods.ChangeLangFromDataAttr();
    }

});

$$(document).on("click", ".GotoRegisterPage", function () {
    app.methods.GoToSignupPage();
});

$$(document).on("click", ".RegTypeMerchant", function () {
    if (!$$(this).hasClass("active")) {
        $$(".RegTypeDriver").removeClass("active");
        $$(this).addClass("active");
        $$(".AppearForMerchant").show();
        $$(".AppearForDriver").hide();
        $$(".ProfileTitle").html("رفع صورة العلامة التجارية");
    }
});

$$(document).on("click", ".RegTypeDriver", function () {
    if (!$$(this).hasClass("active")) {
        $$(".RegTypeMerchant").removeClass("active");
        $$(this).addClass("active");
        $$(".AppearForDriver").show();
        $$(".AppearForMerchant").hide();
        $$(".ProfileTitle").html("الصورة الشخصية");
    }
});

$$(document).on("click", ".GotoForgetPasswordPage", function () {
    app.methods.GoToForgetPage();
});

$$(document).on("click", ".gotoLogin", function () {
    app.methods.GoToLoginPage();
});

//goToNewOrder
$$(document).on("click", ".goToNewOrder", function () {
    mainView.router.navigate(
        {
            name: 'neworder'
        },
        {
        });
});

//goToTrackingOrders
$$(document).on("click", ".goToTrackingOrders", function () {
    mainView.router.navigate(
        {
            name: 'merchanttracking'
        },
        {
        });
});

//goTomerchantbalancelogs
$$(document).on("click", ".goToOrdersList", function () {
    mainView.router.navigate(
        {
            name: 'merchantbalancelogs'
        },
        {
        });
});

//goToChargeBalance
$$(document).on("click", ".goToChargeBalance", function () {
    mainView.router.navigate(
        {
            name: 'chargebalance'
        },
        {
        });
});

//goToDriverReports
$$(document).on("click", ".goToDriverReports", function () {
    mainView.router.navigate(
        {
            name: 'driverReport'
        },
        {
        });
});

//goToDriverBalanceLog
$$(document).on("click", ".goToDriverBalanceLog", function () {
    mainView.router.navigate(
        {
            name: 'driverbalancelogs'
        },
        {
        });
});

//contact us send
$$(document).on("click", ".SendContactUs", function () {
    var Name = $$(mainView.router.currentPageEl).find("#Name").val();
    var Email = $$(mainView.router.currentPageEl).find("#Email").val();
    var SMS = $$(mainView.router.currentPageEl).find("#SMS").val();
    if (Name.trim() != "" && Email.trim() != "" && SMS.trim() != "") {
        app.preloader.show();
        var data = {
            Name: Name,
            Email: Email,
            SMS: SMS
        };
        var q = "" + app.data.hosting.ApiUrl + "/Client/Contactus";
        app.methods.MakaAjaxCall(q, "POST", data, function (e) {
            e = JSON.parse(e);
            app.preloader.hide();
            if (e == true) {
                $$(mainView.router.currentPageEl).find("#Name").val('');
                $$(mainView.router.currentPageEl).find("#Email").val('');
                $$(mainView.router.currentPageEl).find("#SMS").val('');
                var toastBottom = app.toast.create({
                    text: localStorage.lang == "en" ? 'Sent Successfully' : 'تم الإرسال بنجاح',
                    closeTimeout: 2000
                });
                toastBottom.open();

            }
            else {
                var toastBottom = app.toast.create({
                    text: localStorage.lang == "en" ? 'Error, try again later' : 'خطأ، حاول مجدداً لاحقاً',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
        }, function (error, status) {
            app.preloader.hide();
        });
    }
    else {
        app.methods.AlertMissingFields();
    }
});

$$(document).on("click", ".GotoTermsPage", function () {
    app.preloader.show();
    var q = "" + app.data.hosting.ApiUrl + "/Info/GetAppTerms";
    app.request.get(q, function (e) {
        e = JSON.parse(e);
        app.preloader.hide();
        var obj = {
            Current: localStorage.lang == "en" ? e.termsAndConditionsEn : e.termsAndConditionsAr
        };
        mainView.router.navigate(
            {
                name: 'terms'
            },
            {
                context: {
                    ContentData: obj
                }
            });
    }, function (error) { app.preloader.hide(); });
});

$$(document).on("click", ".GotoAboutPage", function () {
    app.preloader.show();
    var q = "" + app.data.hosting.ApiUrl + "/Info/GetAboutAppInfo";
    app.request.get(q, function (e) {
        e = JSON.parse(e);
        app.preloader.hide();
        var obj = {
            TitleAr: "عن كودك",
            TitleEn: "About Codec",
            Title: localStorage.lang == "en" ? "About Codec" : "عن كودك",
            NameAr: e.aboutAppNameAr,
            NameEn: e.aboutAppNameEn,
            Name: localStorage.lang == "ar" ? e.aboutAppNameAr : e.aboutAppNameEn,
            DescAr: e.aboutAppDescAr,
            DescEn: e.aboutAppDescEn,
            Desc: localStorage.lang == "ar" ? e.aboutAppDescAr : e.aboutAppDescEn,
            AddressAr: e.addressAr,
            AddressEn: e.addressEn,
            Address: localStorage.lang == "ar" ? e.addressAr : e.addressEn,
            WorkingAr: e.workingHoursAr,
            WorkingEn: e.workingHoursEn,
            Working: localStorage.lang == "ar" ? e.workingHoursAr : e.workingHoursEn,
            ContactOnly: e.contactPhones,
            ContactAr: 'رقم الهاتف: ' + e.contactPhones,
            ContactEn: 'Phone: ' + e.contactPhones,
            Contact: localStorage.lang == "ar" ? 'رقم الهاتف: ' + e.contactPhones : 'Phone: ' + e.contactPhones,

            ContactEmailAr: 'البريد الإلكتروني: ' + e.contactEmail,
            ContactEmailEn: 'Email: ' + e.contactEmail,
            ContactEmail: localStorage.lang == "ar" ? 'البريد الإلكتروني: ' + e.contactEmail : 'Email: ' + e.contactEmail,

        };
        mainView.router.navigate(
            {
                name: 'about'
            },
            {
                context: {
                    ContentData: obj
                }
            });
    }, function (error) { });
});

//change language AR/EN
$$(document).on("change", ".atabicEnglishCheck", function () {
    if ($$(this).hasClass("arabicchecked")) {//arabic

        localStorage.lang = "ar";
        $$("#arabic-style").attr("href", "");
        $$("#arabic-framework").attr("href", "css/framework7.bundle.rtl.min.css");
        app.rtl = true;
        app.methods.ChangeLangFromDataAttr();
        app.methods.AlterLangInDB("ar");

    }
    else {//english

        localStorage.lang = "en";
        $$("#arabic-style").attr("href", "css/style-ltr.css");
        $$("#arabic-framework").attr("href", "");
        app.rtl = false;
        app.methods.ChangeLangFromDataAttr();
        app.methods.AlterLangInDB("en");

    }
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

        var obj = {
            Phone: cr.userMobile
        };
        mainView.router.navigate(
            {
                name: 'index'
            },
            {
                reloadAll: true,
                clearPreviousHistory: true,
                transition: 'f7-circle',
            });
    }
});


$$(document).on("click", ".GoToHomePage", function () {
    mainView.router.navigate(
        {
            name: 'index'
        },
        {
            reloadAll: true,
            clearPreviousHistory: true,
        });
});

$$(document).on("click", ".GoToHomePageAnimated", function () {
    mainView.router.navigate(
        {
            name: 'index'
        },
        {
            transition: 'f7-circle',
        });
});

$$(document).on("click", ".GoToHomePageNoAnimate", function () {
    mainView.router.navigate(
        {
            name: 'index'
        },
        {
        });
});

$$(document).on("click", ".GoToCompleteProfile", function () {

    var type = 0;
    var cr = "";
    if (localStorage.ClientCredintial) {
        cr = JSON.parse(localStorage.ClientCredintial);
        if (cr.isActive == true) {
            type = cr.typeIdFk;
        }
    }
    if (type == 1) {
        mainView.router.navigate(
            {
                name: 'merchantcompletedata'
            },
            {

            });
    }
    else {
        lockey = Math.floor((Math.random() * 10000) + 1000);

        var lat = cr.lat;
        var lng = cr.lng;
        var circle = cr.circleKm;
        if (lat == null || lat == 0) {
            lat = "24.78523";
            lng = "46.6869141";
            circle = 5;
        }

        var html = app.MapCirclePopupTemplate();
        var dynamicPopup = app.popup.create({
            content: html,
            closeByBackdropClick: false,
            on: {
                open: function (popup) {
                    //init or change map here 
                    long_parm = lng;
                    lat_parm = lat;
                    zoom_parm = 10;
                    reduce_parm = Number(circle);

                    document.getElementById('MymapCircle').src = "https://maps.dizzlr.co/circule.aspx?set=true&MapsKey=AIzaSyDWfNs9qtoiVLuXE8TPv-Hg3IvyVDxX0nc&long_parm=" + long_parm + "&lat_parm=" + lat_parm + "&reduce_parm=" + reduce_parm + "&zoom_parm=" + zoom_parm + "&key=" + lockey;
                }
            }
        });
        dynamicPopup.open();
    }

});

$$(document).on("click", ".gotoProfile", function () {

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

        var obj = {
            Phone: cr.userMobile
        };
        mainView.router.navigate(
            {
                name: 'myprofile'
            },
            {
                context: {
                    ContentData: obj
                }
            });
    }
});

//go to store
$$(document).on("click", ".GotoAppStore", function () {
    var deviceType = (navigator.userAgent.match(/iPad/i)) == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i)) == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
    if (deviceType == "iPhone" || deviceType == "iPad") {
        openBrowser("https://play.google.com/store/apps/details?id=io.codec.app");
    }
    else {
        openBrowser("https://play.google.com/store/apps/details?id=io.codec.app");
    }
});
$$(document).on("click", ".GoToBackPage", function () {
    mainView.router.back();
});


//share
$$(document).on("click", ".ShareLinkBtn", function () {
    var deviceType = (navigator.userAgent.match(/iPad/i)) == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i)) == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
    var link = "https://play.google.com/store/apps/details?id=io.codec.app";
    if (deviceType == "iPhone" || deviceType == "iPad") {
        link = "https://play.google.com/store/apps/details?id=io.codec.app";
    }
    else {
        link = "https://play.google.com/store/apps/details?id=io.codec.app";
    }
    if (localStorage.lang == "ar") {
        var options = {
            message: 'تطبيق كودك', // not supported on some apps (Facebook, Instagram)
            subject: 'كودك', // fi. for email
            url: link,
            chooserTitle: 'مشاركة التطبيق خلال' // Android only, you can override the default share sheet title
        };
        window.plugins.socialsharing.shareWithOptions(options, function () { }, function () { });
    }
    else {
        var options = {
            message: 'Codec App', // not supported on some apps (Facebook, Instagram)
            subject: 'Codec', // fi. for email
            url: link,
            chooserTitle: 'Share Via' // Android only, you can override the default share sheet title
        };
        window.plugins.socialsharing.shareWithOptions(options, function () { }, function () { });
    }
});

//open whats app
$$(document).on("click", ".whatsapp-phone-start", function () {
    window.location.href = 'whatsapp://send?phone=' + $$(this).data("phone");
});

$$(document).on("click", ".openInMap", function () {
    var lat = $$(this).attr("data-lat");
    var lng = $$(this).attr("data-lng");

    var geocoords = '' + lat + ',' + lng;

    try {
        launchnavigator.isAppAvailable(launchnavigator.APP.GOOGLE_MAPS, function (isAvailable) {
            var app;
            if (isAvailable) {
                app = launchnavigator.APP.GOOGLE_MAPS;
            } else {
                app = launchnavigator.APP.USER_SELECT;
            }
            launchnavigator.navigate(geocoords, {
                app: app
            });
        });
    } catch (e) { }
});

$$(document).on("click", ".callNumber", function () {
    var number = $$(this).attr("data-phone");
    var bypassAppChooser = true;
    try {
        number = number.replace('+', '00');
    } catch (e) {

    }
    window.plugins.CallNumber.callNumber(onSuccess, onError, number, bypassAppChooser);
});

function onSuccess(result) {
    console.log("Success:" + result);
}

function onError(result) {
    console.log("Error:" + result);
}