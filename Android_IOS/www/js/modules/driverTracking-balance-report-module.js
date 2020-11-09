$$(document).on("tab:show", '#tab-new,#tab-current,#tab-old', function () {
    app.methods.LoadDriverHomePageAnyTab();
});


$$(document).on('infinite', '.infinite-scroll-content-home', function () {
    if (!allowInfinite_Partener_tab_new) return;

    // Set loading flag
    allowInfinite_Partener_tab_new = false;

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


    var OffersHolder = $$(mainView.router.currentPageEl).find("#" + containerToBind);
    var offersChildren = Number($$(OffersHolder).find(".order-item").length);

    var preloader_ = $$(mainView.router.currentPageEl).find("." + loaderitem);
    var pgnum = Number($$(preloader_).data("nextpgnum"));

    if ($$(mainView.router.currentPageEl).find("." + loaderitem).length == 0 && typeof pgnum == typeof NaN) {
        allowInfinite_Partener_tab_new = false;
        return;
    }

    completepara += "pagenum=" + pgnum + "&pagesize=50";

    q = "" + app.data.hosting.ApiUrl + "/Driver/GetAllOrders?" + completepara;

    app.methods.MakaAjaxCall(q, "POST", null, function (e) {
        if (e != "")
            e = JSON.parse(e);

        if (e == "" || e == null || e.length == 0 || (offersChildren + e.length >= e[0].overall_count)) {
            if (e.length > 0) {
                var html = app.DriverOrderListTemplate({
                    FAQS: e,
                });
                $$(mainView.router.currentPageEl).find("#" + containerToBind).append(html);
                $$(preloader_).data("nextpgnum", Number($$(preloader_).data("nextpgnum")) + 1);
            }
            $$(mainView.router.currentPageEl).find("." + loaderitem).css("display", "none");
            app.infiniteScroll.destroy($$(mainView.router.currentPageEl).find(".infinite-scroll-content-home"));
            return;
        }
        else {
            var html = app.DriverOrderListTemplate({
                FAQS: e,
            });
            $$(mainView.router.currentPageEl).find("#" + containerToBind).append(html);
            $$(preloader_).data("nextpgnum", Number($$(preloader_).data("nextpgnum")) + 1);
        }
        allowInfinite_Partener_tab_new = true;
    }, function (error) {
        allowInfinite_Partener_tab_new = true;
    });
});


$$(document).on("click", ".DriverManageConfirm", function () {
    var id = $$(this).data("id");
    var agree = $$(this).data("agree");
    var parent = $$(this).parent().parent().parent();
    var data = {
        Id: id,
        IsReturned: agree,
    };

    app.preloader.show();
    var q = "" + app.data.hosting.ApiUrl + "/Driver/ManageConfirmOrder";
    app.methods.MakaAjaxCall(q, "POST", data, function (e) {
        e = JSON.parse(e);
        if (e == 1) {
            if (agree == "true") {
                var toastBottom = app.toast.create({
                    text: localStorage.lang == "en" ? 'تم قبول الطلب بنجاح' : 'تم قبول الطلب بنجاح',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else {
                var toastBottom = app.toast.create({
                    text: localStorage.lang == "en" ? 'تم رفض الطلب بنجاح' : 'تم رفض الطلب بنجاح',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            $$(parent).remove();
            app.methods.LoadDriverHomePageAnyTab();
            app.preloader.hide();
        }
        else if (e == -1) {
            var toastBottom = app.toast.create({
                text: localStorage.lang == "en" ? 'غير مسموح قبول او رفض الطلب' : 'غير مسموح قبول او رفض الطلب',
                closeTimeout: 2000
            });
            toastBottom.open();
            $$(parent).remove();
            app.methods.LoadDriverHomePageAnyTab();
            app.preloader.hide();
        }
        else {
            app.preloader.hide();
            var toastBottom = app.toast.create({
                text: localStorage.lang == "en" ? 'Error, try again later' : 'خطأ، حاول مجدداً لاحقاً',
                closeTimeout: 2000
            });
            toastBottom.open();
        }
    }, function (error, status) {
        app.preloader.hide();
    });
});

$$(document).on("click", ".DriverManageOrderSts", function () {
    var id = $$(this).data("id");
    var StatusIdFk = $$(this).data("sts");
    var parent = $$(this).parent().parent().parent();
    var data = {
        Id: id,
        StatusIdFk: StatusIdFk,
    };

    app.preloader.show();
    var q = "" + app.data.hosting.ApiUrl + "/Driver/ManageOrder";
    app.methods.MakaAjaxCall(q, "POST", data, function (e) {
        e = JSON.parse(e);
        if (e == 1) {
            if (StatusIdFk == "3") {
                var toastBottom = app.toast.create({
                    text: localStorage.lang == "en" ? 'تم استلام الشحنة من المستودع بنجاح' : 'تم استلام الشحنة من المستودع بنجاح',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else {
                var toastBottom = app.toast.create({
                    text: localStorage.lang == "en" ? 'تم تسليم الشحنة للعميل بنجاح' : 'تم تسليم الشحنة للعميل بنجاح',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            app.methods.LoadDriverHomePageAnyTab();
            app.preloader.hide();
        }
        else if (e == -1) {
            var toastBottom = app.toast.create({
                text: localStorage.lang == "en" ? 'غير مسموح التعامل مع الطلب، ليس لديك الصلاحية حالياً' : 'غير مسموح التعامل مع الطلب، ليس لديك الصلاحية حالياً',
                closeTimeout: 2000
            });
            toastBottom.open();
            app.methods.LoadDriverHomePageAnyTab();
            app.preloader.hide();
        }
        else {
            app.preloader.hide();
            var toastBottom = app.toast.create({
                text: localStorage.lang == "en" ? 'Error, try again later' : 'خطأ، حاول مجدداً لاحقاً',
                closeTimeout: 2000
            });
            toastBottom.open();
        }
    }, function (error, status) {
        app.preloader.hide();
    });
});

//----------------------------------------------------------------------------------report--------------------------------------------------------------------
$$(document).on("page:afterin", '.page[data-name="driverReport"]', function () {

    q = "" + app.data.hosting.ApiUrl + "/Driver/GetDriverReport";
    app.methods.MakaAjaxCall(q, "POST", null, function (e) {
        if (e != "")
            e = JSON.parse(e);

        var html = app.DriverReportTemplate({
            totalPoints: e.totalPoints,
            avgRatings: e.avgRatings,
        });
        $$(mainView.router.currentPageEl).find(".report-container").html(html);

        app.methods.ChangeLangFromDataAttr();

    }, function (error) {

    });
});

//----------------------------------------------------------------------------------balance log--------------------------------------------------------------------

$$(document).on("page:afterin", '.page[data-name="driverbalancelogs"]', function () {
    allowInfinite_Partener2 = true;
    var userid = 0;
    if (localStorage.ClientCredintial) {
        var cr = JSON.parse(localStorage.ClientCredintial);
        if (cr.isActive == true)
            userid = cr.userId;
    }
    var q = "";
    var completepara = "";

    completepara += "pagenum=1&pagesize=50";

    if (userid == 0) {
        //
    }
    else {
        q = "" + app.data.hosting.ApiUrl + "/Driver/GetAllDriverBalanceLog?" + completepara;
    }

    app.methods.MakaAjaxCall(q, "POST", null, function (e) {
        if (e != "")
            e = JSON.parse(e);

        $$(mainView.router.currentPageEl).find(".main-holder").show();

        if (e == null || e.length == 0) {
            $$(mainView.router.currentPageEl).find(".currentBalance").html("الرصيد الحالي: 0 ريال");
        }
        else {
            var notnullbalance = e.filter(p => p.balance != null);
            $$(mainView.router.currentPageEl).find(".currentBalance").html("الرصيد الحالي: " + Number(notnullbalance[0].balance).toFixed(1) + " ريال");
        }



        var html = app.OrdersListPriceTemplate({
            FAQS: e,
        });
        $$(mainView.router.currentPageEl).find(".Parteners-Page-Container2").html(html);

        app.methods.ChangeLangFromDataAttr();

        if (e != null && e.length > 0) {
            if (e[0].overall_count > e.length) {
                app.infiniteScroll.create($$(mainView.router.currentPageEl).find(".infinite-scroll-content-partener2"));
                $$(mainView.router.currentPageEl).find(".parteners-page-preloader2").css("display", "block");
                $$(mainView.router.currentPageEl).find(".parteners-page-preloader2").data("nextpgnum", Number($$(mainView.router.currentPageEl).find(".parteners-page-preloader2").data("nextpgnum")) + 1);
            }
            else {
                $$(mainView.router.currentPageEl).find(".parteners-page-preloader2").css("display", "none");
                app.infiniteScroll.destroy($$(mainView.router.currentPageEl).find(".infinite-scroll-content-partener2"));
                $$(mainView.router.currentPageEl).find(".parteners-page-preloader2").remove();
            }
        }
    }, function (error) {

    });

});

var allowInfinite_Partener2 = true;
$$(document).on('infinite', '.infinite-scroll-content-partener2', function () {
    if (!allowInfinite_Partener2) return;

    // Set loading flag
    allowInfinite_Partener2 = false;

    var userid = 0;
    if (localStorage.ClientCredintial) {
        var cr = JSON.parse(localStorage.ClientCredintial);
        if (cr.isActive == true)
            userid = cr.userId;
    }



    var OffersHolder = $$(mainView.router.currentPageEl).find(".Parteners-Page-Container2");
    var offersChildren = Number($$(OffersHolder).find(".buy-timeline-item").length);

    var preloader_ = $$(mainView.router.currentPageEl).find(".parteners-page-preloader2");
    var pgnum = Number($$(preloader_).data("nextpgnum"));

    if ($$(mainView.router.currentPageEl).find(".parteners-page-preloader2").length == 0 && typeof pgnum == typeof NaN) {
        allowInfinite_Partener2 = false;
        return;
    }

    var q = "";
    var completepara = "";

    completepara += "pagenum=" + pgnum + "&pagesize=50";

    if (userid == 0) {
        q = "";
    }
    else {
        q = "" + app.data.hosting.ApiUrl + "/Driver/GetAllDriverBalanceLog?" + completepara;
    }

    app.methods.MakaAjaxCall(q, "POST", null, function (e) {
        if (e != "")
            e = JSON.parse(e);

        if (e == "" || e == null || e.length == 0 || (offersChildren + e.length >= e[0].overall_count)) {
            if (e.length > 0) {
                var html = app.OrdersListPriceTemplate({
                    FAQS: e,
                });
                $$(mainView.router.currentPageEl).find(".Parteners-Page-Container2").append(html);
                $$(preloader_).data("nextpgnum", Number($$(preloader_).data("nextpgnum")) + 1);
            }
            app.infiniteScroll.destroy($$(mainView.router.currentPageEl).find(".infinite-scroll-content-partener2"));
            $$(mainView.router.currentPageEl).find(".parteners-page-preloader2").remove();
            return;
        }
        else {
            var html = app.OrdersListPriceTemplate({
                FAQS: e,
            });
            $$(mainView.router.currentPageEl).find(".Parteners-Page-Container2").append(html);
            $$(preloader_).data("nextpgnum", Number($$(preloader_).data("nextpgnum")) + 1);
        }
        allowInfinite_Partener2 = true;
    }, function (error) {
        allowInfinite_Partener2 = true;
    });
});
