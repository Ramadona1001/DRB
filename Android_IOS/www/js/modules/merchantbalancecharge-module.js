$$(document).on("page:afterin", '.page[data-name="merchantbalancelogs"]', function () {
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
        q = "" + app.data.hosting.ApiUrl + "/Merchant/GetAllMerchantBalanceLog?" + completepara;
    }

    app.methods.MakaAjaxCall(q, "POST", null, function (e) {
        if (e != "")
            e = JSON.parse(e);

        $$(mainView.router.currentPageEl).find(".main-holder").show();

        if (e == null || e.length == 0) {
            $$(mainView.router.currentPageEl).find(".currentBalance").html("0 ريال");
        }
        else {
            var notnullbalance = e.filter(p => p.balance != null);
            $$(mainView.router.currentPageEl).find(".currentBalance").html(Number(notnullbalance[0].balance).toFixed(1) + " ريال");
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
        q = "" + app.data.hosting.ApiUrl + "/Merchant/GetAllMerchantBalanceLog?" + completepara;
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

$$(document).on("click", ".goToAddPaymentMethodPopup2", function () {
    var html = app.OrderPaymentPopupTemplate({ id: 0, wallet: null });
    var dynamicPopup = app.popup.create({
        content: html,
        closeByBackdropClick: true,
        on: {
            open: function (popup) {

            }
        }
    });
    dynamicPopup.open();
    app.methods.ChangeLangFromDataAttr();
});

$$(document).on("click", ".ConfirmChargeBalance", function () {
    var BalanceValue = $$(mainView.router.currentPageEl).find(".BalanceValue").val();
    if (BalanceValue.trim() != "") {
        var data = {
            CurrentBalance: BalanceValue,
        };

        var cr = JSON.parse(localStorage.ClientCredintial);
        if (!cr.isApproved || !cr.isCompleted) {
            var toastBottom = app.toast.create({
                text: localStorage.lang == "en" ? 'خطأ، غير مسموح اضافة رصيد حالياً' : 'خطأ، غير مسموح اضافة رصيد حالياً',
                closeTimeout: 2000
            });
            toastBottom.open();
            app.methods.GoToWaitingApprovePage();
            return;
        }

        app.preloader.show();
        var q = "" + app.data.hosting.ApiUrl + "/Merchant/ChargeBalance";
        app.methods.MakaAjaxCall(q, "POST", data, function (e) {
            e = JSON.parse(e);
            app.preloader.hide();
            if (e.sts == 1) {

                var cr = JSON.parse(localStorage.ClientCredintial);
                cr.isCompleted = e.clientData.isCompleted;
                cr.isApproved = e.clientData.isApproved;
                localStorage.ClientCredintial = JSON.stringify(cr);

                if (!cr.isApproved || !cr.isCompleted) {
                    var toastBottom = app.toast.create({
                        text: localStorage.lang == "en" ? 'خطأ، غير مسموح اضافة رصيد حالياً' : 'خطأ، غير مسموح اضافة رصيد حالياً',
                        closeTimeout: 2000
                    });
                    toastBottom.open();
                    app.methods.GoToWaitingApprovePage();
                    return;
                }
                else {
                    var toastBottom = app.toast.create({
                        text: localStorage.lang == "en" ? 'تم شحن الرصيد بنجاح' : 'تم شحن الرصيد بنجاح',
                        closeTimeout: 2000
                    });
                    toastBottom.open();

                    mainView.router.back();

                }

            }
            else if (e.sts == -1 || e.sts == -2) {
                var toastBottom = app.toast.create({
                    text: localStorage.lang == "en" ? 'خطأ، غير مسموح اضافة رصيد حالياً' : 'خطأ، غير مسموح اضافة رصيد حالياً',
                    closeTimeout: 2000
                });
                toastBottom.open();
                app.methods.GoToWaitingApprovePage();
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