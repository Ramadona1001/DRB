$$(document).on("page:afterin", '.page[data-name="merchanttracking"]', function () {
    allowInfinite_Partener = true;
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
        q = "" + app.data.hosting.ApiUrl + "/Merchant/GetAllOrders?" + completepara;
    }

    app.methods.MakaAjaxCall(q, "POST", null, function (e) {
        if (e != "")
            e = JSON.parse(e);

        $$(mainView.router.currentPageEl).find(".loader-holder").hide();
        $$(mainView.router.currentPageEl).find(".main-holder").show();

        var html = app.OrdersListTemplate({
            FAQS: e,
        });
        $$(mainView.router.currentPageEl).find(".Parteners-Page-Container").html(html);

        if (e == null || e.length == 0) {
            initMap(e);
        }
        else {
            var mapPointsArr = [];
            mapPointsArr = e.filter(p => p.lat != null);
            initMap(mapPointsArr);
        }

        app.methods.ChangeLangFromDataAttr();

        if (e != null && e.length > 0) {
            if (e[0].overall_count > e.length) {
                app.infiniteScroll.create($$(mainView.router.currentPageEl).find(".infinite-scroll-content-partener"));
                $$(mainView.router.currentPageEl).find(".parteners-page-preloader").css("display", "block");
                $$(mainView.router.currentPageEl).find(".parteners-page-preloader").data("nextpgnum", Number($$(mainView.router.currentPageEl).find(".parteners-page-preloader").data("nextpgnum")) + 1);
            }
            else {
                $$(mainView.router.currentPageEl).find(".parteners-page-preloader").css("display", "none");
                app.infiniteScroll.destroy($$(mainView.router.currentPageEl).find(".infinite-scroll-content-partener"));
                $$(mainView.router.currentPageEl).find(".parteners-page-preloader").remove();
            }
        }
    }, function (error) {

    });

});

var allowInfinite_Partener = true;
$$(document).on('infinite', '.infinite-scroll-content-partener', function () {
    if (!allowInfinite_Partener) return;

    // Set loading flag
    allowInfinite_Partener = false;

    var userid = 0;
    if (localStorage.ClientCredintial) {
        var cr = JSON.parse(localStorage.ClientCredintial);
        if (cr.isActive == true)
            userid = cr.userId;
    }



    var OffersHolder = $$(mainView.router.currentPageEl).find(".Parteners-Page-Container");
    var offersChildren = Number($$(OffersHolder).find(".partners-item").length);

    var preloader_ = $$(mainView.router.currentPageEl).find(".parteners-page-preloader");
    var pgnum = Number($$(preloader_).data("nextpgnum"));

    if ($$(mainView.router.currentPageEl).find(".parteners-page-preloader").length == 0 && typeof pgnum == typeof NaN) {
        allowInfinite_Partener = false;
        return;
    }

    var q = "";
    var completepara = "";

    completepara += "pagenum=" + pgnum + "&pagesize=50";

    if (userid == 0) {
        q = "";
    }
    else {
        q = "" + app.data.hosting.ApiUrl + "/Merchant/GetAllOrders?" + completepara;
    }

    app.methods.MakaAjaxCall(q, "POST", null, function (e) {
        if (e != "")
            e = JSON.parse(e);

        if (e == "" || e == null || e.length == 0 || (offersChildren + e.length >= e[0].overall_count)) {
            if (e.length > 0) {
                var html = app.OrdersListTemplate({
                    FAQS: e,
                });
                $$(mainView.router.currentPageEl).find(".Parteners-Page-Container").append(html);
                $$(preloader_).data("nextpgnum", Number($$(preloader_).data("nextpgnum")) + 1);
            }
            app.infiniteScroll.destroy($$(mainView.router.currentPageEl).find(".infinite-scroll-content-partener"));
            $$(mainView.router.currentPageEl).find(".parteners-page-preloader").remove();
            return;
        }
        else {
            var html = app.OrdersListTemplate({
                FAQS: e,
            });
            $$(mainView.router.currentPageEl).find(".Parteners-Page-Container").append(html);
            $$(preloader_).data("nextpgnum", Number($$(preloader_).data("nextpgnum")) + 1);
        }
        allowInfinite_Partener = true;
    }, function (error) {
        allowInfinite_Partener = true;
    });
});


$$(document).on("click", ".cancel-order-btn", function () {
    var id = $$(this).data("id");
    var html = app.FilterPageTemplate(
        {
            title1: localStorage.lang == "en" ? "الغاء طلب" : "الغاء طلب",
            title3: localStorage.lang == "en" ? "تأكيد" : "تأكيد",
            id: id
        }
    );
    var dynamicPopup = app.popup.create({
        content: html,
        closeByBackdropClick: false
    });
    dynamicPopup.open(true);

});

$$(document).on("click", ".ConfirmCancelOrderBtn", function () {
    var id = $$(this).data("id");
    var reason = $$(".OrderCancelReasonArea").val();
    if (id != "0" && reason.trim() != "") {
        var data = {
            Id: id,
            CancelReson: reason,
        };

        app.preloader.show();
        var q = "" + app.data.hosting.ApiUrl + "/Merchant/CancelOrder";
        app.methods.MakaAjaxCall(q, "POST", data, function (e) {
            e = JSON.parse(e);
            app.preloader.hide();
            if (e != null) {
                if (e[0].id == 0) {
                    var toastBottom = app.toast.create({
                        text: localStorage.lang == "en" ? 'غير مسموح حذف الطلب' : 'غير مسموح حذف الطلب',
                        closeTimeout: 2000
                    });
                    toastBottom.open();
                    return;
                }
                else if (e[0].id == -1) {
                    var toastBottom = app.toast.create({
                        text: localStorage.lang == "en" ? 'حالة الطلب تمنع عملية الحذف' : 'حالة الطلب تمنع عملية الحذف',
                        closeTimeout: 2000
                    });
                    toastBottom.open();
                }
                else {
                    app.popup.close();
                    var toastBottom = app.toast.create({
                        text: localStorage.lang == "en" ? 'Deleted Successfully' : 'تم الحذف بنجاح',
                        closeTimeout: 2000
                    });
                    toastBottom.open();
                    var html2 = app.OrdersListTemplate({
                        FAQS: e,
                    });
                    var htmlToBind = $$($$(html2)[0]).html();
                    $$(mainView.router.currentPageEl).find(".one-order-item[data-id='" + data.Id + "']").html(htmlToBind);
                }
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

