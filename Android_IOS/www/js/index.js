
$$(document).on("page:beforein", '.page[data-name="index"]', function () {
    $$(".home-container").html('<div class="card skeleton-text skeleton-effect-fade"><div class="card-header">Card Header</div><div class="card-content card-content-padding">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi lobortis et massa ac interdum. Cras consequat felis at consequat hendrerit.</div><div class="card-footer">Card Footer</div></div><div class="card skeleton-text skeleton-effect-fade"><div class="card-header">Card Header</div><div class="card-content card-content-padding">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi lobortis et massa ac interdum. Cras consequat felis at consequat hendrerit.</div><div class="card-footer">Card Footer</div></div>');
});
$$(document).on("page:afterin", '.page[data-name="index"]', function () {
    app.methods.LoadHomePage();
});

$$(document).on("page:afterin", '.page[data-name="thanks"]', function () {
    try {
        cordova.plugins.Keyboard.close();
    } catch (e) {

    }
});


//---------------------------------------------------Loading home page--------------------------------------------------------

app.methods.InitializeLanguageForFirstTime_HideElementsNeedLogin();
app.methods.LoadHomePage();
app.methods.OrganizeLayoutBasedOnCredintial();
app.methods.ChangeLangFromDataAttr();

//For test only - remove this line after test
//app.methods.AutomaticAuthenticate();


//var userid = 0;
//if (localStorage.ClientCredintial) {
//    var cr = JSON.parse(localStorage.ClientCredintial);
//    if (cr.isActive == true)
//        userid = cr.userId;
//}
//if (userid == 0) {
//    app.methods.GetAllCitiesCached();
//}
//else {
//    app.methods.SetupAjaxRequestHeader();
//    app.methods.GetAllGetSetupDataCached();
//}

//-----------------------------------------------------------------------------------------------------------

var toastAppear = 0;
var iconappear = 0;
var globalurl = "";
function loopforinternet() {
    setInterval(function () {
        try {
            var message = "تأكد من اتصالك بالانترنت";
            if (localStorage.lang == "en")
                message = "Check you internet connection";
            var networkState = navigator.connection.type;
            if (networkState == Connection.NONE) {
                if (toastAppear == 0) {
                    window.plugins.toast.showWithOptions({
                        message: message,
                        duration: "short", // 2000 ms
                        position: "bottom",
                        styling: {
                            opacity: 0.75, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
                            textSize: 13, // Default is approx. 13.
                            cornerRadius: 16, // minimum is 0 (square). iOS default 20, Android default 100
                            horizontalPadding: 20, // iOS default 16, Android default 50
                            verticalPadding: 16 // iOS default 12, Android default 30
                        }
                    });
                    toastAppear = 1;
                }
                iconappear = 1;
                return;
            }
            else {
                toastAppear = 0;
                if (iconappear == 1) {
                    iconappear = 0;
                    app.methods.AutomaticAuthenticate();
                }
            }
        } catch (ec) {

        }
    }, 1000);
}

var exitcode = 0;

function DeviceIsSeriesX() {
    //https://www.theiphonewiki.com/wiki/Models
    var model = "" + window.device.model + "";
    if (
        model.toLowerCase() == "iPhone11,4".toLowerCase() ||
        model.toLowerCase() == "iPhone11,6".toLowerCase() ||
        model.toLowerCase() == "iPhone11,2".toLowerCase() ||
        model.toLowerCase() == "iPhone11,8".toLowerCase() ||
        model.toLowerCase() == "iPhone10,6".toLowerCase() ||
        model.toLowerCase() == "iPhone10,3".toLowerCase()
    )
        return true;
    else return false;
}

if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android)/)) {
    document.addEventListener("deviceready", onDeviceReady, false);
    document.addEventListener("resume", onResume, false);
    document.addEventListener("pause", onPause, false);
} else {
    onDeviceReady();
}

function onResume() {

}
function onPause() {

}
document.addEventListener("menubutton", function () {

}, true);
document.addEventListener("backbutton", function (e) {
    goBack();
    e.preventDefault();
}, false);
function goBack() {
    if (app.popup.get('.popup') != undefined)
        app.popup.close();
    else if ($$(mainView.router.currentPageEl).attr("data-name") != "index" && $$(mainView.router.currentPageEl).attr("data-name") != "thanks" && $$(mainView.router.currentPageEl).attr("data-name") != "login" && $$(mainView.router.currentPageEl).attr("data-name") != "signup")
        mainView.router.back();
    else {
        if (exitcode == 0) {
            exitcode = 1;
            var message = "إضغط مرة اخرى للخروج";
            if (localStorage.lang == "en")
                message = "Press again to exit";
            window.plugins.toast.showWithOptions({
                message: message,
                duration: "short", // 2000 ms
                position: "bottom",
                styling: {
                    opacity: 0.75, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
                    textSize: 13, // Default is approx. 13.
                    cornerRadius: 16, // minimum is 0 (square). iOS default 20, Android default 100
                    horizontalPadding: 20, // iOS default 16, Android default 50
                    verticalPadding: 16 // iOS default 12, Android default 30
                }
            });
            setTimeout(function () { exitcode = 0; }, 5000);
        }
        else {
            navigator.app.exitApp();
        }
    }
}
function onDeviceReady() {

    var deviceType = (navigator.userAgent.match(/iPad/i)) == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i)) == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
    if (deviceType == "iPhone" || deviceType == "iPad") {
        try {
            StatusBar.overlaysWebView(false);
            StatusBar.backgroundColorByHexString("#FFFFFF");
            StatusBar.styleDefault();
        } catch (e) {
            console.log(e.toString());
        }


        if (DeviceIsSeriesX()) {
            $('head').append('<link rel="stylesheet" href="css/style-iphonex.css" type="text/css" />');
        }



    }
    else {
        try {
            AndroidFullScreen.showSystemUI(function () { }, function () { });
        } catch (e) {
        }

        try {
            //StatusBar.overlaysWebView(false);
            StatusBar.backgroundColorByHexString("#FFFFFF");
            StatusBar.styleDefault();
        } catch (e) {
            console.log(e.toString());
        }

    }






    try {
        // available => Android
        rootdetection.isDeviceRooted(function (result) {
            if (result == 1) {
                //if (localStorage.lang == "en")
                //    alert("your device enable rooted, the app will be closed");
                //else
                //    alert("");
                navigator.app.exitApp();
            }
        }, function () { });
    } catch (rrr) {

    }

    try {
        var isSim = device.isVirtual;
        if (isSim == true) {
            //if (localStorage.lang == "en")
            //    alert("your device is virtual, the app will be closed");
            //else
            //    alert("");
            navigator.app.exitApp();
        }
    } catch (e) {

    }

    loopforinternet();
    //cached home page items
    //automatic authenticate
    app.methods.AutomaticAuthenticate();


    var userid = 0;
    if (localStorage.ClientCredintial) {
        var cr = JSON.parse(localStorage.ClientCredintial);
        if (cr.isActive == true)
            userid = cr.userId;
    }
    if (userid == 0) {
        //app.methods.GetAllCitiesCached();
    }
    else {
        app.methods.SetupAjaxRequestHeader();
        app.methods.GetAllGetSetupDataCached();
    }

}



if (navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
    app.preloader.show = function () {
        try {
            var options = { dimBackground: false };
            SpinnerPlugin.activityStart("Loading...", options);
        } catch (e) {

        }
    }
    app.preloader.hide = function () {
        try {
            SpinnerPlugin.activityStop();
        } catch (err) {
            //alert(err.message);
        }
    }
}
