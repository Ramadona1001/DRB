// Dom7
var $$ = Dom7;

// Theme
var theme = 'auto';
if (document.location.search.indexOf('theme=') >= 0) {
    theme = document.location.search.split('theme=')[1].split('&')[0];
}

// Init App
var app = new Framework7({
    id: 'io.drb.app',
    root: '#app',
    theme: theme,
    data: function () {
        return {
            searchCriteria: {
                filterFromDate: "",
                filterToDate: "",
                filterCat: "",
                filterCatId: 0,
            },
            NotificActive: false,
            PlayedVideoInBack: [],
            tempPlacesData: [],
            tempSavedPlaces: "",
            WelcomeSliderAppear: false, //-------> Show/hide welcome (Intro) slider
            OneSignalAppID: "508a62a0-7c02-49eb-a7f5-c676cc0fa163",
            APiKey: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            hosting: {
                AppUrl: '',
               ApiUrl: 'https://darbapi.dizzlr.co/api', //real api url
                //ApiUrl: 'https://localhost:44323/api'
            },
            indexLoaded: false,
            deviceLoaded: false
        };
    },
    dialog: {
        title: '',
        buttonOk: 'موافق',
        buttonCancel: 'الغاء'
    },
    methods: {
        MsgBox: function (title, str) {
            var deviceType = (navigator.userAgent.match(/iPad/i)) == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i)) == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
            if (deviceType == "iPhone" || deviceType == "iPad")
                app.dialog.alert(title, '');
            else {
                navigator.notification.alert(
                    title,  // message
                    function () { },         // callback
                    'درب',            // title
                    'موافق'                  // buttonName
                );
            }
        },
        AlertWithCustomMSG: function (msg) {
            app.methods.MsgBox(msg, '');
        },
        AlertWrongPhoneNumber: function () {
            if (localStorage.lang == "en") {
                var toastBottom = app.toast.create({
                    text: 'Phone number must start with 05 and contains 10 digits',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else {
                var toastBottom = app.toast.create({
                    text: 'الرجاء التحقق من بداية رقم الجوال ب 05 ويتكون من 10 خانات',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
        },
        AlertWrongPhoneNumber: function () {
            if (localStorage.lang == "en") {
                var toastBottom = app.toast.create({
                    text: 'Phone number must start with 05 and contains 10 digits',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else {
                var toastBottom = app.toast.create({
                    text: 'الرجاء التحقق من بداية رقم الجوال ب 05 ويتكون من 10 خانات',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
        },
        AlertFaildToReadTransaction: function () {
            if (localStorage.lang == "en") {
                var toastBottom = app.toast.create({
                    text: 'Failed to read transaction',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else {
                var toastBottom = app.toast.create({
                    text: 'فشل التعرف على العملية، هذه العملية قيد التطوير',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
        },
        AlertTryAgainError: function () {
            if (localStorage.lang == "en") {
                var toastBottom = app.toast.create({
                    text: 'Error, try again later',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else {
                var toastBottom = app.toast.create({
                    text: 'خطأ, برجاء المحاولة مرة أخرى',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
        },
        AlertPassChangedSuccess: function () {
            if (localStorage.lang == "en") {
                var toastBottom = app.toast.create({
                    text: 'Password changed successfully',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else {
                var toastBottom = app.toast.create({
                    text: 'تم تغيير كلمة المرور بنجاح',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
        },
        AlertLoginError: function () {
            if (localStorage.lang == "en") {
                var toastBottom = app.toast.create({
                    text: 'Error in login data',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else {
                var toastBottom = app.toast.create({
                    text: 'خطأ فى بيانات الدخول',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
        },
        AlertConfirmPassError: function () {
            if (localStorage.lang == "en") {
                var toastBottom = app.toast.create({
                    text: 'Password and confirm password must be matched',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else {
                var toastBottom = app.toast.create({
                    text: 'يجب تطابق كلمة المرور وتأكيد كلمة المرور',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
        },
        AlertAgreeOnTermsError: function () {
            if (localStorage.lang == "en") {
                var toastBottom = app.toast.create({
                    text: 'Agree on Terms and Conditions',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else {
                var toastBottom = app.toast.create({
                    text: 'الرجاء الموافقة على الشروط والأحكام',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
        },
        AlertAgreeOnTermsSMSError: function () {
            if (localStorage.lang == "en") {
                var toastBottom = app.toast.create({
                    text: 'Agree on Terms and Conditions',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else {
                var toastBottom = app.toast.create({
                    text: 'الرجاء الموافقة على إتفاقية الإستخدام',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
        },
        AlertRepeatedAccountError: function () {
            if (localStorage.lang == "en") {
                var toastBottom = app.toast.create({
                    text: 'Sorry, this account used before',
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
        },
        AlertMissingMobileForReset: function () {
            if (localStorage.lang == "en") {
                var toastBottom = app.toast.create({
                    text: 'Check that you fill Phone',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else {
                var toastBottom = app.toast.create({
                    text: 'الرجاء التأكد من تعبئة رقم الجوال',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
        },
        AlertMissingEmailForReset: function () {
            if (localStorage.lang == "en") {
                var toastBottom = app.toast.create({
                    text: 'Check that you fill Email',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else {
                var toastBottom = app.toast.create({
                    text: 'الرجاء التأكد من تعبئة البريد الإلكتروني',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
        },
        AlertMissingFields: function () {
            if (localStorage.lang == "en") {
                var toastBottom = app.toast.create({
                    text: 'Check that you fill all fields',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else {
                var toastBottom = app.toast.create({
                    text: 'الرجاء التأكد من تعبئة جميع الحقول',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
        },
        AlertCanotGetLatLng: function () {
            if (localStorage.lang == "en") {
                var toastBottom = app.toast.create({
                    text: 'فشل التعرف على العنوان المحدد في الخريطة، حاول وضع العلامة الحمراء في مكان اكثر تحديداّ',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else {
                var toastBottom = app.toast.create({
                    text: 'فشل التعرف على العنوان المحدد في الخريطة، حاول وضع العلامة الحمراء في مكان اكثر تحديداّ',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
        },
        AlertCanotGetLatLngCircle: function () {
            if (localStorage.lang == "en") {
                var toastBottom = app.toast.create({
                    text: 'فشل التعرف على النطاق الجغرافي في الخريطة، حاول تحريك منتصف الدائرة في مكان اكثر تحديداّ ',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else {
                var toastBottom = app.toast.create({
                    text: 'فشل التعرف على النطاق الجغرافي في الخريطة، حاول تحريك منتصف الدائرة في مكان اكثر تحديداّ',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
        },
        AlertResetSuccess: function () {
            if (localStorage.lang == "en") {
                var toastBottom = app.toast.create({
                    text: 'Confirmation code was sent to your email',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else {
                var toastBottom = app.toast.create({
                    text: 'تم إرسال كود التأكيد للبريد الإلكتروني الخاص بك',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
        },
        AlertRestFailed: function () {
            if (localStorage.lang == "en") {
                var toastBottom = app.toast.create({
                    text: 'User not found',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else {
                var toastBottom = app.toast.create({
                    text: 'المستخدم غير موجود',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
        },
        InitializeLanguageForFirstTime_HideElementsNeedLogin: function () {
            $$(".AppearAfterLogin").hide();
            $$(".AppearAfterLoginForMerchant").hide();
            $$(".AppearAfterLoginForDriver").hide();
            if (!localStorage.lang)
                localStorage.lang = "ar";
            else {
                if (localStorage.lang == "en") {
                    $$("#arabic-style").attr("href", "css/style-ltr.css");
                    $$("#arabic-framework").attr("href", "");
                    app.rtl = false;
                }
            }
        },
        GoToWaitingApprovePage: function () {
            var obj = {
                Title1: "عزيزي التاجر تم قبول طلبك بنجاح",
                Title2: "يرجى استكمال بيانات الملف الشخصي",
                Title3: "ملفي الشخصي",
                Title4: "GoToCompleteProfile",
            };

            var type = 0;
            var cr = "";
            if (localStorage.ClientCredintial) {
                cr = JSON.parse(localStorage.ClientCredintial);
                if (cr.isActive == true) {
                    type = cr.typeIdFk;
                }
            }
            if (type == 0) {
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
            else {
                if (type == 2) {
                    obj = {
                        Title1: "عزيزي السائق تم قبول طلبك بنجاح",
                        Title2: "حسابك قيد المراجعة من قبل الادارة، وسيتم تنبيهك بعد اعتماد الحساب",
                        Title3: "الصفحة الرئيسية",
                        Title4: "GoToHomePageAnimated",
                    };
                    if (!cr.isCompleted) {
                        obj.Title2 = "يرجى تحديد نطاقك الجغرافي";
                        obj.Title3 = "ملفي الشخصي";
                        obj.Title4 = "GoToCompleteProfile";
                    }
                }
                else {
                    if (!cr.isApproved && cr.isCompleted) {
                        obj.Title1 = "عزيزي التاجر شكراً لإستكمال بياناتك";
                        obj.Title2 = "حسابك قيد المراجعة من قبل الادارة، وسيتم تنبيهك بعد اعتماد الحساب";
                        obj.Title3 = "الصفحة الرئيسية";
                        obj.Title4 = "GoToHomePageAnimated";
                    }
                }

                mainView.router.navigate(
                    {
                        name: 'thanks'
                    },
                    {
                        context: {
                            ContentData: obj
                        }
                    });
            }


        },
        GoToSignupPage: function (backappear) {
            var obj = {
                BackAppear: false,
                merchant: 'active',
                driver: ''
            };

            mainView.router.navigate(
                {
                    name: 'signup'
                },
                {
                    reloadCurrent: true,
                    force: true,
                    context: {
                        ContentData: obj
                    }
                });
        },
        GoToLoginPage: function () {
            mainView.router.navigate(
                {
                    name: 'login'
                },
                {
                });
        },
        GoToConfirmPage: function (num) {
            var obj = {
                Title: localStorage.lang == "en" ? "Email Confirmation" : "تأكيد البريد الإلكتروني",
                Text: localStorage.lang == "en" ? "Enter confirmation code that sent to your email" : "أدخل كود التأكيد المرسل إلى بريدك الإلكتروني",
                Code: localStorage.lang == "en" ? "Confirmation code" : "كود التأكيد",
                Again: localStorage.lang == "en" ? "Resend confirmation code" : "إعادة إرسال كود التأكيد",
                Phone: num
            };

            mainView.router.navigate(
                {
                    name: 'confirm'
                },
                {
                    context: {
                        ContentData: obj
                    }
                });
        },
        GoToConfirmPageAfterChangeMobile: function (num) {
            var obj = {
                Title: localStorage.lang == "en" ? "Email Confirmation" : "تأكيد البريد الإلكتروني",
                Text: localStorage.lang == "en" ? "Enter confirmation code that sent to your email" : "أدخل كود التأكيد المرسل إلى بريدك الإلكتروني",
                Code: localStorage.lang == "en" ? "Confirmation code" : "كود التأكيد",
                Again: localStorage.lang == "en" ? "Resend confirmation code" : "إعادة إرسال كود التأكيد",
                Phone: num
            };

            mainView.router.navigate(
                {
                    name: 'confirm'
                },
                {
                    reloadAll: true,
                    clearPreviousHistory: true,
                    context: {
                        ContentData: obj
                    }
                });
        },
        GoToForgetPage: function () {
            var obj = {
                Title: localStorage.lang == "en" ? "Forget Password" : "نسيت كلمة المرور",
                Text: localStorage.lang == "en" ? "New password will be sent to your email" : "ستصلك رسالة بكلمة المرور الجديدة عبر بريدك الإلكتروني",
                Code: localStorage.lang == "en" ? "Email" : "بريدك الإلكتروني",
                Again: localStorage.lang == "en" ? "Resend Password" : "إعادة إرسال كلمة المرور",
            };

            mainView.router.navigate(
                {
                    name: 'forgetpassword'
                },
                {
                    context: {
                        ContentData: obj
                    }
                });
        },
        GoToConfirmPageAfterChangeEmail: function () {
            var obj = {
                Title: localStorage.lang == "en" ? "Email Confirmation" : "تأكيد البريد الإلكتروني",
                Text: localStorage.lang == "en" ? "Enter confirmation code that sent to your new email" : "أدخل كود التأكيد المرسل إلى بريدك الإلكتروني الجديد",
                Code: localStorage.lang == "en" ? "Confirmation code" : "كود التأكيد",
                Again: localStorage.lang == "en" ? "Resend confirmation code" : "إعادة إرسال كود التأكيد",
            };

            mainView.router.navigate(
                {
                    name: 'confirm'
                },
                {
                    reloadAll: true,
                    clearPreviousHistory: true,
                    context: {
                        ContentData: obj
                    }
                });
        },
        OrganizeLayoutBasedOnCredintial: function () {
            var userid = 0;
            var cr = "";
            if (localStorage.ClientCredintial) {
                cr = JSON.parse(localStorage.ClientCredintial);
                if (cr.isActive == true)
                    userid = cr.userId;
            }
            if (userid == 0) {
                //show/hide ui
                $$(".AppearAfterLogin").hide();
                $$(".AppearBeforeLogin").show();
            }
            else {
                //show/hide ui
                $$(".AppearAfterLogin").show();
                $$(".AppearBeforeLogin").hide();

                //show/hide sidebar for merchant or driver
                if (cr.typeIdFk == 1) {
                    $$(".AppearAfterLoginForDriver").hide();
                    $$(".AppearAfterLoginForMerchant").show();
                }
                else if (cr.typeIdFk == 2) {
                    $$(".AppearAfterLoginForMerchant").hide();
                    $$(".AppearAfterLoginForDriver").show();
                }
            }
        },
        GetAllGetSetupDataCached: function () {
            if (!sessionStorage.allCities || !sessionStorage.allCats || !sessionStorage.allPackageTypes) {
                q = "" + app.data.hosting.ApiUrl + "/Helper/GetSetupData";
                app.methods.MakaAjaxCall(q, "GET", null, function (e) {
                    e = JSON.parse(e);

                    if (e.allCities != null)
                        sessionStorage.allCities = JSON.stringify(e.allCities);
                    if (e.allCats != null)
                        sessionStorage.allCats = JSON.stringify(e.allCats);
                    if (e.allPackageTypes != null)
                        sessionStorage.allPackageTypes = JSON.stringify(e.allPackageTypes);
                },
                    function (error) {

                    });
            }
        },
        GetAllCitiesCached: function () {
            if (!sessionStorage.allCities) {
                q = "" + app.data.hosting.ApiUrl + "/Helper/GetAllCities";
                app.request.get(q, function (e) {
                    sessionStorage.allCities = e;
                },
                    function (error) {

                    });
            }
        },
        GetAllCitiesCachedBeforeSign: function (forceit = false) {
            if (!sessionStorage.allCities || forceit) {
                q = "" + app.data.hosting.ApiUrl + "/Helper/GetAllCities";
                app.request.get(q, function (e) {
                    sessionStorage.allCities = e;
                    e = JSON.parse(e);

                    //Call template and bind returned object
                    var html = app.DropListPageTemplate(
                        {
                            ChooseTitle: 'المدينة',
                            FAQs: e,
                        });


                    if ($$(".myMapPopup").find(".SelectedCity").length > 0) {
                        $$(".myMapPopup").find(".SelectedCity").html(html);
                    }
                    else if ($$(mainView.router.currentPageEl).find(".SelectedCity").length > 0) {
                        $$(mainView.router.currentPageEl).find(".SelectedCity").html(html);
                    }

                },
                    function (error) {

                    });
            }
            else {
                e = sessionStorage.allCities;
                e = JSON.parse(e);

                //Call template and bind returned object
                var html = app.DropListPageTemplate(
                    {
                        ChooseTitle: 'المدينة',
                        FAQs: e,
                    });
                if ($$(".myMapPopup").find(".SelectedCity").length > 0) {
                    $$(".myMapPopup").find(".SelectedCity").html(html);
                }
                else if ($$(mainView.router.currentPageEl).find(".SelectedCity").length > 0) {
                    $$(mainView.router.currentPageEl).find(".SelectedCity").html(html);
                }
            }
        },
        GetAllPreparedTimesCachedBeforeLoadPage: function () {
            if (!sessionStorage.allTimes) {
                q = "" + app.data.hosting.ApiUrl + "/Helper/GetAllPreparationTimes";
                app.methods.MakaAjaxCall(q, "GET", null, function (e) {
                    sessionStorage.allTimes = e;
                    e = JSON.parse(e);

                    //Call template and bind returned object
                    var html = app.DropListPageTemplate(
                        {
                            ChooseTitle: 'اوقات تجهيز الطرود',
                            FAQs: e,
                        });
                    $$(mainView.router.currentPageEl).find(".SelectedPrepaedTimes").html(html);
                },
                    function (error) {

                    });
            }
            else {
                e = sessionStorage.allTimes;
                e = JSON.parse(e);

                //Call template and bind returned object
                var html = app.DropListPageTemplate(
                    {
                        ChooseTitle: 'اوقات تجهيز الطرود',
                        FAQs: e,
                    });
                $$(mainView.router.currentPageEl).find(".SelectedPrepaedTimes").html(html);
            }
        },
        GetAllDailyNumOrdersCachedBeforeLoadPage: function () {
            if (!sessionStorage.allOrdersNum) {
                q = "" + app.data.hosting.ApiUrl + "/Helper/GetAllNumOfOrders";
                app.methods.MakaAjaxCall(q, "GET", null, function (e) {
                    sessionStorage.allOrdersNum = e;
                    e = JSON.parse(e);

                    //Call template and bind returned object
                    var html = app.DropListPageTemplate(
                        {
                            ChooseTitle: 'عدد الطلبات المتوقعة يومياً',
                            FAQs: e,
                        });
                    $$(mainView.router.currentPageEl).find(".SelectedNumOfDailyOrders").html(html);
                },
                    function (error) {

                    });
            }
            else {
                e = sessionStorage.allOrdersNum;
                e = JSON.parse(e);

                //Call template and bind returned object
                var html = app.DropListPageTemplate(
                    {
                        ChooseTitle: 'عدد الطلبات المتوقعة يومياً',
                        FAQs: e,
                    });
                $$(mainView.router.currentPageEl).find(".SelectedNumOfDailyOrders").html(html);
            }
        },
        GetAllCatsCachedBeforeLoadPage: function (ContainerClassName, showFirst = true) {
            if (!sessionStorage.allCats) {
                q = "" + app.data.hosting.ApiUrl + "/Helper/GetAllCats";
                app.methods.MakaAjaxCall(q, "GET", null, function (e) {
                    sessionStorage.allCats = e;
                    e = JSON.parse(e);

                    //Call template and bind returned object
                    var html = app.DropListPageTemplate(
                        {
                            ChooseTitle: showFirst ? 'النوع' : null,
                            FAQs: e,
                        });

                    if ($$(".myOrderPackageInfoPopup").find("." + ContainerClassName).length > 0) {
                        $$(".myOrderPackageInfoPopup").find("." + ContainerClassName).html(html);
                    }
                    else if ($$(mainView.router.currentPageEl).find("." + ContainerClassName).length > 0) {
                        $$(mainView.router.currentPageEl).find("." + ContainerClassName).html(html);
                    }
                },
                    function (error) {

                    });
            }
            else {
                e = sessionStorage.allCats;
                e = JSON.parse(e);

                //Call template and bind returned object
                var html = app.DropListPageTemplate(
                    {
                        ChooseTitle: showFirst ? 'النوع' : null,
                        FAQs: e,
                    });
                if ($$(".myOrderPackageInfoPopup").find("." + ContainerClassName).length > 0) {
                    $$(".myOrderPackageInfoPopup").find("." + ContainerClassName).html(html);
                }
                else if ($$(mainView.router.currentPageEl).find("." + ContainerClassName).length > 0) {
                    $$(mainView.router.currentPageEl).find("." + ContainerClassName).html(html);
                }
            }
        },
        GetAllPackageTypesCachedBeforeLoadPage: function (ContainerClassName) {
            if (!sessionStorage.allPackageTypes) {
                q = "" + app.data.hosting.ApiUrl + "/Helper/GetAllPackageTypes";
                app.methods.MakaAjaxCall(q, "GET", null, function (e) {
                    sessionStorage.allPackageTypes = e;
                    e = JSON.parse(e);

                    //Call template and bind returned object
                    var html = app.DropListPageTemplate(
                        {
                            ChooseTitle: 'حجم الطرد',
                            FAQs: e,
                        });

                    if ($$(".myOrderPackageInfoPopup").find("." + ContainerClassName).length > 0) {
                        $$(".myOrderPackageInfoPopup").find("." + ContainerClassName).html(html);
                    }
                    else if ($$(mainView.router.currentPageEl).find("." + ContainerClassName).length > 0) {
                        $$(mainView.router.currentPageEl).find("." + ContainerClassName).html(html);
                    }
                },
                    function (error) {

                    });
            }
            else {
                e = sessionStorage.allPackageTypes;
                e = JSON.parse(e);

                //Call template and bind returned object
                var html = app.DropListPageTemplate(
                    {
                        ChooseTitle: 'حجم الطرد',
                        FAQs: e,
                    });

                if ($$(".myOrderPackageInfoPopup").find("." + ContainerClassName).length > 0) {
                    $$(".myOrderPackageInfoPopup").find("." + ContainerClassName).html(html);
                }
                else if ($$(mainView.router.currentPageEl).find("." + ContainerClassName).length > 0) {
                    $$(mainView.router.currentPageEl).find("." + ContainerClassName).html(html);
                }
            }
        },
        GetAllStoresCachedBeforeLoadPage: function (ContainerClassName) {
            if (!sessionStorage.stores) {
                q = "" + app.data.hosting.ApiUrl + "/Helper/GetAllStores";
                app.methods.MakaAjaxCall(q, "GET", null, function (e) {
                    sessionStorage.stores = e;
                    e = JSON.parse(e);

                    //Call template and bind returned object
                    var html = app.DropListPageTemplate(
                        {
                            ChooseTitle: 'مستودع استلام الشحنة',
                            FAQs: e,
                        });
                    $$(mainView.router.currentPageEl).find("." + ContainerClassName).html(html);
                },
                    function (error) {

                    });
            }
            else {
                e = sessionStorage.stores;
                e = JSON.parse(e);

                //Call template and bind returned object
                var html = app.DropListPageTemplate(
                    {
                        ChooseTitle: 'مستودع استلام الشحنة',
                        FAQs: e,
                    });
                $$(mainView.router.currentPageEl).find("." + ContainerClassName).html(html);
            }
        },
        LoadDriverHomePageAnyTab: function () {
            allowInfinite_Partener_tab_new = true;
            $$(mainView.router.currentPageEl).find(".parteners-page-preloader-current").css("display", "none");
            $$(mainView.router.currentPageEl).find(".parteners-page-preloader-old").css("display", "none");
            $$(mainView.router.currentPageEl).find(".parteners-page-preloader-new").css("display", "none");

            var activeTab = $$(mainView.router.currentPageEl).find(".tab-active").attr("id");

            var q = "";
            var completepara = "";
            var loaderitem = "";
            var containerToBind = "tab-new";

            if (activeTab == "tab-new") {
                loaderitem = "parteners-page-preloader-new";
                completepara = "sts=2&";
                containerToBind = "tab-new";
            }
            else if (activeTab == "tab-current") {
                loaderitem = "parteners-page-preloader-current";
                completepara = "sts=3,4&";
                containerToBind = "tab-current";
            }
            else if (activeTab == "tab-old") {
                loaderitem = "parteners-page-preloader-old";
                completepara = "sts=5,6&";
                containerToBind = "tab-old";
            }

            var userid = 0;
            if (localStorage.ClientCredintial) {
                var cr = JSON.parse(localStorage.ClientCredintial);
                if (cr.isActive == true)
                    userid = cr.userId;
            }


            completepara += "pagenum=1&pagesize=50";

            if (userid == 0) {
                //
            }
            else {
                q = "" + app.data.hosting.ApiUrl + "/Driver/GetAllOrders?" + completepara;
            }

            app.methods.MakaAjaxCall(q, "POST", null, function (e) {
                if (e != "")
                    e = JSON.parse(e);

                var html = app.DriverOrderListTemplate({
                    FAQS: e,
                });
                $$(mainView.router.currentPageEl).find("#" + containerToBind).html(html);


                app.methods.ChangeLangFromDataAttr();

                if (e != null && e.length > 0) {
                    if (e[0].overall_count > e.length) {
                        app.infiniteScroll.create($$(mainView.router.currentPageEl).find(".infinite-scroll-content-home"));
                        $$(mainView.router.currentPageEl).find("." + loaderitem).css("display", "block");
                        $$(mainView.router.currentPageEl).find("." + loaderitem).data("nextpgnum", Number($$(mainView.router.currentPageEl).find("." + loaderitem).data("nextpgnum")) + 1);
                    }
                    else {
                        $$(mainView.router.currentPageEl).find("." + loaderitem).css("display", "none");
                        app.infiniteScroll.destroy($$(mainView.router.currentPageEl).find(".infinite-scroll-content-home"));
                    }
                }
            }, function (error) {

            });
        },
        LoadHomePage: function () {
            if (!localStorage.intro && app.data.WelcomeSliderAppear == true) {
                localStorage.intro = true;
                var html = app.IntroPopupTemplate({});
                var dynamicPopup = app.popup.create({
                    content: html,
                    closeByBackdropClick: false,
                    on: {
                        open: function (popup) {
                            app.swiper.create('.swiper-container.intro-slider', {
                                spaceBetween: 0,
                                pagination: {
                                    el: '.swiper-pagination.intropaginate',
                                    type: 'bullets'
                                }
                            });
                        }
                    }
                });
                dynamicPopup.open(false);
                app.methods.ChangeLangFromDataAttr();
                return;
            }
            else {

                if (app.data.WelcomeSliderAppear == false && !localStorage.intro) {
                    localStorage.intro = true;
                    app.methods.GoToSignupPage();
                    app.methods.GetAllCitiesCachedBeforeSign(true);
                    return;
                }

                var userid = 0;
                var type = 0;
                var cr = "";
                if (localStorage.ClientCredintial) {
                    cr = JSON.parse(localStorage.ClientCredintial);
                    if (cr.isActive == true) {
                        userid = cr.userId;
                        type = cr.typeIdFk;
                    }
                }
                if (userid == 0) {
                    mainView.router.navigate(
                        {
                            name: 'login'
                        },
                        {
                            reloadCurrent: true,
                            force: true,
                        });
                }
                else {
                    app.methods.SetupAjaxRequestHeader();
                    if (type == 1) {
                        var q = "" + app.data.hosting.ApiUrl + "/Merchant/GetMerchantHomeModel";
                        app.methods.MakaAjaxCall(q, "POST", null, function (e) {
                            e = JSON.parse(e);

                            //Call template and bind returned object
                            var html = app.MerchantHomeTemplate(
                                {
                                    currentOrders: e.currentOrders,
                                    finishedOrders: e.finishedOrders,
                                    nextOrders: e.nextOrders,
                                });
                            $$(mainView.router.currentPageEl).find(".home-container").html(html);

                            if (maploaded) {
                                try {
                                    initMap(e.orderList);
                                } catch (ecc) {
                                    console.log(ecc);
                                }
                            }
                            else {
                                //loop till maps api finish loading
                                var intervalmap = setInterval(function () {
                                    if (maploaded) {
                                        clearInterval(intervalmap);
                                        try {
                                            initMap(e.orderList);
                                        } catch (ecc) {
                                            console.log(ecc);
                                        }
                                    }
                                }, 50);
                            }


                            app.methods.ChangeLangFromDataAttr();

                        }, function (error) {
                            //alert(error.status)
                        });
                    }
                    else {
                        var html = app.DriverHomeTemplate(
                            {

                            });
                        $$(mainView.router.currentPageEl).find(".home-container").html(html);
                        //load data in first tab
                        app.methods.LoadDriverHomePageAnyTab();
                    }
                }
            }
        },
        ChangeLangFromDataAttr: function () {
            var allelements = $$(".ChangeLang");
            for (var i = 0; len = allelements.length, i < len; i++) {
                if (localStorage.lang == "en")
                    $$(allelements[i]).html($$(allelements[i]).data("en"));
                else
                    $$(allelements[i]).html($$(allelements[i]).data("ar"));
            }
        },
        AlterLangInDB: function (lng) {
            var q = "" + app.data.hosting.ApiUrl + "/Client/SaveRegLang?lng=" + lng;
            app.methods.MakaAjaxCall(q, "GET", null, function (ef) {
            },
                function (er) { /*alert(er)*/ });
        },
        CheckHaveNotSeen: function (clientid) {
            //try {
            //    var q = "" + app.data.hosting.ApiUrl + "/Client/HaveNotSeen";
            //    app.methods.MakaAjaxCall(q, "GET", null, function (ef) {
            //        if (ef == true || ef == "true") {
            //            app.data.NotificActive = true;
            //            $$(".item-Notific").addClass("noti-active");
            //        }
            //        else {
            //            app.data.NotificActive = false;
            //            $$(".item-Notific").removeClass("noti-active");
            //        }
            //    },
            //        function (er) { /*alert(er)*/ });
            //} catch (e) {

            //}
        },
        HandleNotifications: function (clientid) {
            //alert("inside init notifi");
            var notificationOpenedCallback = function (jsonData) {
                //alert(jsonData);
                console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
            };
            var notificationReceiveCallback = function (jsonData) {
                app.data.NotificActive = true;
                //$$(".item-Notific").addClass("noti-active");
            };
            try {
                window.plugins.OneSignal.startInit(app.data.OneSignalAppID).handleNotificationOpened(notificationOpenedCallback).handleNotificationReceived(notificationReceiveCallback).inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification).endInit();
                window.plugins.OneSignal.registerForPushNotifications();
                // Only works if user previously subscribed and you used setSubscription(false) below
                window.plugins.OneSignal.setSubscription(true);

                window.plugins.OneSignal.getIds(function (ids) {
                    try {
                        //alert("#2" + JSON.stringify(ids));
                        var regid = ids.userId;
                        var q = "" + app.data.hosting.ApiUrl + "/Client/SaveRegIdsWithLang?regid=" + regid;
                        //alert(q);
                        app.methods.MakaAjaxCall(q, "GET", null, function (ef) { /*alert(ef);*/ }, function (er) { /*alert(er)*/ });
                    } catch (e) {
                        //alert("SaveRegistrationId#" + e.toString());
                    }
                });
            } catch (e) {
            }
        },
        AutomaticAuthenticate: function () {
            if (localStorage.loginMobile && localStorage.token) {
                var data = {
                    Mobile: localStorage.loginMobile,
                    Password: localStorage.token
                };
                var q = "" + app.data.hosting.ApiUrl + "/Account/Authentication";
                app.request.post(q, data, function (e) {
                    e = JSON.parse(e);
                    if (e.userStatus != 0 && e.userStatus != -1 && e.userStatus != -2 && e.userStatus != -3 && e.userStatus == 1 && !e.isBlocked && e.isActive) {//save credintial and redirect to home page
                        localStorage.ClientCredintial = JSON.stringify(e);
                        //$$(".user-login-name").html(e.name);
                        localStorage.token = e.authKey_;
                        //app.request.setup({
                        //    headers: {
                        //        'UserId': e.userId,
                        //        'Email': e.email,
                        //        'authKey': e.authKey,
                        //        'Pr': e.pr
                        //    }
                        //});
                        app.methods.SetupAjaxRequestHeader();
                        try {
                            app.methods.HandleNotifications(e.userId);
                        } catch (cdsvdsfv) {

                        }
                        app.methods.CheckHaveNotSeen(e.userId);

                        setTimeout(function () {
                            app.methods.GetAllGetSetupDataCached();
                        }, 500);


                        if (!e.isApproved || !e.isCompleted) {
                            app.methods.GoToWaitingApprovePage();
                        }
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
                        app.methods.GoToSignupPage(false);
                    }
                    else if (e.userStatus == -2) {
                        localStorage.ClientCredintial = JSON.stringify(e);
                        //redirect to confirm code page
                        if (localStorage.lang == "en") {
                            var toastBottom = app.toast.create({
                                text: 'Login to confirm your email',
                                closeTimeout: 2000
                            });
                            toastBottom.open();
                        }
                        else {
                            var toastBottom = app.toast.create({
                                text: 'سجل دخولك وقم بتأكيد بريدك الإلكتروني',
                                closeTimeout: 2000
                            });
                            toastBottom.open();
                        }
                        app.methods.GoToLoginPage();
                    }
                    else {
                        //remove credintials
                        localStorage.removeItem("ClientCredintial");
                        localStorage.removeItem("loginMobile");
                        localStorage.removeItem("loginPassword");
                        //inform client that he is blocked
                        if (localStorage.lang == "en") {
                            var toastBottom = app.toast.create({
                                text: 'You should login to the app',
                                closeTimeout: 2000
                            });
                            toastBottom.open();
                        }
                        else {
                            var toastBottom = app.toast.create({
                                text: 'ينبغى تسجيل دخولك للتطبيق',
                                closeTimeout: 2000
                            });
                            toastBottom.open();
                        }
                        app.methods.GoToLoginPage();
                    }
                    app.methods.OrganizeLayoutBasedOnCredintial();
                }, function (error) {
                });
            }
        },
        AutomaticAuthenticateAfterConfirmation: function () {
            if (localStorage.loginMobile && localStorage.token) {
                var data = {
                    Mobile: localStorage.loginMobile,
                    Password: localStorage.token
                };
                var q = "" + app.data.hosting.ApiUrl + "/Account/Authentication";
                app.request.post(q, data, function (e) {
                    e = JSON.parse(e);
                    if (e.userStatus != 0 && e.userStatus != -1 && e.userStatus != -2 && e.userStatus != -3 && e.userStatus == 1 && !e.isBlocked && e.isActive) {//save credintial and redirect to home page
                        localStorage.ClientCredintial = JSON.stringify(e);
                        //$$(".user-login-name").html(e.name);
                        localStorage.token = e.authKey_;
                        app.methods.SetupAjaxRequestHeader();

                        setTimeout(function () {
                            try {
                                app.methods.HandleNotifications(e.userId);
                                app.methods.CheckHaveNotSeen(e.userId);
                            } catch (edf) {
                                //
                            }
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
                        if (!e.isApproved || !e.isCompleted) {
                            app.methods.GoToWaitingApprovePage();
                        }
                        else {
                            //go to home page
                            mainView.router.navigate({ name: 'index' }, { reloadAll: true });
                        }
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
                        app.methods.GoToSignupPage(false);
                    }
                    else if (e.userStatus == -2) {
                        localStorage.ClientCredintial = JSON.stringify(e);
                        //redirect to confirm code page
                        if (localStorage.lang == "en") {
                            var toastBottom = app.toast.create({
                                text: 'Login to confirm your email',
                                closeTimeout: 2000
                            });
                            toastBottom.open();
                        }
                        else {
                            var toastBottom = app.toast.create({
                                text: 'سجل دخولك وقم بتأكيد بريدك الإلكتروني',
                                closeTimeout: 2000
                            });
                            toastBottom.open();
                        }
                        app.methods.GoToLoginPage();
                    }
                    else {
                        //remove credintials
                        localStorage.removeItem("ClientCredintial");
                        localStorage.removeItem("loginMobile");
                        localStorage.removeItem("loginPassword");
                        //inform client that he is blocked
                        if (localStorage.lang == "en") {
                            var toastBottom = app.toast.create({
                                text: 'You should login to the app',
                                closeTimeout: 2000
                            });
                            toastBottom.open();
                        }
                        else {
                            var toastBottom = app.toast.create({
                                text: 'ينبغى تسجيل دخولك للتطبيق',
                                closeTimeout: 2000
                            });
                            toastBottom.open();
                        }
                        app.methods.GoToLoginPage();
                    }
                    app.methods.OrganizeLayoutBasedOnCredintial();
                }, function (error) {
                });
            }
            else {
                //remove credintials
                localStorage.removeItem("ClientCredintial");
                localStorage.removeItem("loginMobile");
                localStorage.removeItem("loginPassword");

                var toastBottom = app.toast.create({
                    text: 'ينبغى تسجيل دخولك للتطبيق',
                    closeTimeout: 2000
                });
                toastBottom.open();
                app.methods.GoToLoginPage();
            }
        },
        SetupAjaxRequestHeader: function () {
            if (localStorage.ClientCredintial) {
                var cr = JSON.parse(localStorage.ClientCredintial);
                if (cr.isActive == true)
                    app.request.setup({
                        headers: {
                            'UserId': cr.userId,
                            'Email': cr.email,
                            'authKey': cr.authKey,
                            'Pr': cr.pr
                        },
                    });
            }
        },
        MakaAjaxCall: function (q, type, data, callback, onerror) {
            if (type == "POST") {
                app.request.post(q, data, function (response) {
                    callback(response);
                }, function (error) {
                    if (error.status == 401) {
                        if (localStorage.loginMobile && localStorage.token) {
                            var dataAuth = {
                                Mobile: localStorage.loginMobile,
                                Password: localStorage.token
                            };
                            var qAuth = "" + app.data.hosting.ApiUrl + "/Account/Authentication";
                            app.request.post(qAuth, dataAuth, function (e) {
                                e = JSON.parse(e);
                                if (e.userStatus != 0 && e.userStatus != -1 && e.userStatus != -2 && e.userStatus != -3 && e.userStatus == 1 && !e.isBlocked && e.isActive) {//save credintial and redirect to home page
                                    localStorage.ClientCredintial = JSON.stringify(e);
                                    //$$(".user-login-name").html(e.name);
                                    localStorage.token = e.authKey_;
                                    app.methods.SetupAjaxRequestHeader();
                                    //make the call again
                                    app.request.post(q, data, function (response2) {
                                        callback(response2);
                                    }, function (error2) {
                                        //remove credintials
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
                                    });
                                }
                                else if (e.userStatus == -3) {
                                    //remove credintials
                                    localStorage.removeItem("ClientCredintial");
                                    localStorage.removeItem("loginMobile");
                                    localStorage.removeItem("loginPassword");
                                    var toastBottom = app.toast.create({
                                        text: localStorage.lang == "en" ? 'Your account is blocked' : 'تم حظرك من  دخول التطبيق',
                                        closeTimeout: 2000
                                    });
                                    toastBottom.open();
                                    app.methods.GoToSignupPage(false);
                                }
                                else if (e.userStatus == -2) {
                                    localStorage.ClientCredintial = JSON.stringify(e);
                                    var toastBottom = app.toast.create({
                                        text: localStorage.lang == "en" ? 'Login and confirm your phone' : 'سجل دخولك وقم بتأكيد رقم الهاتف',
                                        closeTimeout: 2000
                                    });
                                    toastBottom.open();
                                    app.methods.GoToLoginPage();
                                }
                                else {
                                    //remove credintials
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
                                app.methods.OrganizeLayoutBasedOnCredintial();
                            }, function (errorAuth) {
                                //remove credintials
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
                            });
                        }
                        else {
                            //remove credintials
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
                    }
                    else {
                        onerror(error)
                    }
                });
            }
            else {
                app.request.get(q, function (response) {
                    callback(response);
                }, function (error) {
                    if (error.status == 401) {
                        if (localStorage.loginMobile && localStorage.token) {
                            var dataAuth = {
                                Mobile: localStorage.loginMobile,
                                Password: localStorage.token
                            };
                            var qAuth = "" + app.data.hosting.ApiUrl + "/Account/Authentication";
                            app.request.post(qAuth, dataAuth, function (e) {
                                e = JSON.parse(e);
                                if (e.userStatus != 0 && e.userStatus != -1 && e.userStatus != -2 && e.userStatus != -3 && e.userStatus == 1 && !e.isBlocked && e.isActive) {//save credintial and redirect to home page
                                    localStorage.ClientCredintial = JSON.stringify(e);
                                    //$$(".user-login-name").html(e.name);
                                    localStorage.token = e.authKey_;
                                    app.methods.SetupAjaxRequestHeader();
                                    //make the call again
                                    app.request.get(q, function (response2) {
                                        callback(response2);
                                    }, function (error2) {
                                        //remove credintials
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
                                    });
                                }
                                else if (e.userStatus == -3) {
                                    //remove credintials
                                    localStorage.removeItem("ClientCredintial");
                                    localStorage.removeItem("loginMobile");
                                    localStorage.removeItem("loginPassword");
                                    var toastBottom = app.toast.create({
                                        text: localStorage.lang == "en" ? 'Your account is blocked' : 'تم حظرك من  دخول التطبيق',
                                        closeTimeout: 2000
                                    });
                                    toastBottom.open();
                                    app.methods.GoToSignupPage(false);
                                }
                                else if (e.userStatus == -2) {
                                    localStorage.ClientCredintial = JSON.stringify(e);
                                    var toastBottom = app.toast.create({
                                        text: localStorage.lang == "en" ? 'Login and confirm your phone' : 'سجل دخولك وقم بتأكيد رقم الهاتف',
                                        closeTimeout: 2000
                                    });
                                    toastBottom.open();
                                    app.methods.GoToLoginPage();
                                }
                                else {
                                    //remove credintials
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
                                app.methods.OrganizeLayoutBasedOnCredintial();
                            }, function (errorAuth) {
                                //remove credintials
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
                            });
                        }
                        else {
                            //remove credintials
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
                    }
                    else {
                        onerror(error)
                    }
                });
            }
        },
    },
    //init stories
    routes: routes,
    on: {
        pageAfterIn: function test(e, page) {
            app.methods.OrganizeLayoutBasedOnCredintial();
            app.methods.ChangeLangFromDataAttr();
            if (app.data.NotificActive == true)
                $$(".item-Notific").addClass("noti-active");
            else
                $$(".item-Notific").removeClass("noti-active");
        }
    },
    //cache: false, /* disable caching */
    //cacheDuration: 0, /* set caching expire time to 0 */
    view: {
        iosDynamicNavbar: false,
    }
});

var mainView = app.views.create('.view-main', {
    //stackPages: true,
    iosSwipeBack: false,
    mdSwipeBack: false
});
