
$$(document).on("page:afterin", '.page[data-name="neworder"]', function () {
    app.methods.GetAllStoresCachedBeforeLoadPage("SelectedStores");

    var calendarPackagesTakenDate = app.calendar.create({
        inputEl: '.PackagesTakenDate',
        closeOnSelect: true
    });
});

$$(document).on("click", ".goToAddPackagePopup", function () {
    var html = app.OrderPackagesPopupTemplate({ id: 0 });
    var dynamicPopup = app.popup.create({
        content: html,
        closeByBackdropClick: true,
        on: {
            open: function (popup) {
                app.methods.GetAllPackageTypesCachedBeforeLoadPage("SelectedPackageSizePopup");
                app.methods.GetAllCatsCachedBeforeLoadPage("SelectedCatPopup", true);
            }
        }
    });
    dynamicPopup.open();
    app.methods.ChangeLangFromDataAttr();
});

$$(document).on("click", ".SavePackageInfoBtn", function () {
    var id = $$(this).data("id");
    var packageTypeIdFK = $$(".myOrderPackageInfoPopup").find(".SelectedPackageSizePopup").val();
    var catIdFK = $$(".myOrderPackageInfoPopup").find(".SelectedCatPopup").val();

    if (packageTypeIdFK != "0" && catIdFK != "0") {
        var eee = document.getElementById("PackageSizePopupId");
        var packageName = $$($$("#PackageSizePopupId").find("option")[eee.selectedIndex]).html();

        var eee2 = document.getElementById("CatPopupId");
        var catName = $$($$("#CatPopupId").find("option")[eee2.selectedIndex]).html();

        if (Number(id) == 0) {
            var oldLength = $$(mainView.router.currentPageEl).find(".orderPackage-section-item").length;

            //get store html
            var obj = {
                packageName: packageName,
                catName: catName,
                packageTypeIdFK: packageTypeIdFK,
                catIdFK: catIdFK,
                id: 0
            };

            obj.id = (oldLength + 1) * -1;
            app.popup.close();
            var html = app.StoresSectionTemplate(
                {
                    FAQsPackages: [obj],
                    FAQs: null
                });
            $$(mainView.router.currentPageEl).find(".packages-list-container").append(html);
        }
        else { //edit on server

            var data = {
                packageName: packageName,
                catName: catName,
                packageTypeIdFK: packageTypeIdFK,
                catIdFK: catIdFK,
                id: id
            }

            app.popup.close();
            $$(mainView.router.currentPageEl).find(".orderPackage-section-item[data-id='" + id + "']").attr("data-packageName", packageName);
            $$(mainView.router.currentPageEl).find(".orderPackage-section-item[data-id='" + id + "']").attr("data-catName", catName);
            $$(mainView.router.currentPageEl).find(".orderPackage-section-item[data-id='" + id + "']").attr("data-packageTypeIdFK", packageTypeIdFK);
            $$(mainView.router.currentPageEl).find(".orderPackage-section-item[data-id='" + id + "']").attr("data-catIdFK", catIdFK);

            $$(mainView.router.currentPageEl).find(".orderPackage-section-item[data-id='" + id + "']").find(".store-cat").html("النوع: " + catName);
            $$(mainView.router.currentPageEl).find(".orderPackage-section-item[data-id='" + id + "']").find(".store-name").html("الحجم: " + packageName);

        }

    }
    else {
        app.methods.AlertMissingFields();
    }
});

$$(document).on("click", ".edit-orderPackage", function () {
    var id = $$(this).data("id");
    var packageTypeIdFK = $$($$(this).parent().parent()).data("packageTypeIdFK");
    var catIdFK = $$($$(this).parent().parent()).data("catIdFK");
    var html = app.OrderPackagesPopupTemplate({ id: id });
    var dynamicPopup = app.popup.create({
        content: html,
        closeByBackdropClick: true,
        on: {
            open: function (popup) {
                app.methods.GetAllPackageTypesCachedBeforeLoadPage("SelectedPackageSizePopup");
                app.methods.GetAllCatsCachedBeforeLoadPage("SelectedCatPopup", true);
                $$(".myOrderPackageInfoPopup").find(".SelectedPackageSizePopup").val(packageTypeIdFK);
                $$(".myOrderPackageInfoPopup").find(".SelectedCatPopup").val(catIdFK);
            }
        }
    });
    dynamicPopup.open();
    app.methods.ChangeLangFromDataAttr();
    $$(".myOrderPackageInfoPopup").find(".SelectedPackageSizePopup").val(packageTypeIdFK);
    $$(".myOrderPackageInfoPopup").find(".SelectedCatPopup").val(catIdFK);
});

$$(document).on("click", ".delete-orderPackage", function () {
    var parentToDelete = $$(this).parent().parent();
    var t1 = "هل أنت متأكد؟";
    var t2 = "درب";
    if (localStorage.lang == "en") {
        t1 = "Are you sure?";
        t2 = "DRB"
    }
    app.dialog.confirm(t1, t2, function () {
        $$(parentToDelete).remove();
    });
});

$$(document).on("click", ".goToAddPaymentMethodPopup", function () {
    var html = app.OrderPaymentPopupTemplate({ id: 0, wallet: 'true' });
    var dynamicPopup = app.popup.create({
        content: html,
        closeByBackdropClick: true,
        on: {
            open: function (popup) {
                app.preloader.show();
                var q = "" + app.data.hosting.ApiUrl + "/Merchant/GetMerchantBalanceWithOrderPrice";
                app.methods.MakaAjaxCall(q, "POST", null, function (e) {
                    e = JSON.parse(e);
                    app.preloader.hide();

                    if (e.merchantShippingPrice > 0) {
                        var cr = JSON.parse(localStorage.ClientCredintial);
                        cr.isCompleted = e.isCompleted;
                        cr.isApproved = e.isApproved;
                        localStorage.ClientCredintial = JSON.stringify(cr);
                        $$(".myOrderPaymentPopup").find(".totalNeedToPay").html('' + Number(e.merchantShippingPrice).toFixed(1) + ' ريال');
                        $$(".myOrderPaymentPopup").find(".wallet-num").html('رصيدك الحالي: ' + Number(e.currentBalance).toFixed(1) + ' ريال');
                        $$(".myOrderPaymentPopup").find(".balance-item").attr('data-balance', Number(e.currentBalance).toFixed(1));
                        $$(".myOrderPaymentPopup").find(".balance-item").attr('data-price', Number(e.merchantShippingPrice).toFixed(1));
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
        }
    });
    dynamicPopup.open();
    app.methods.ChangeLangFromDataAttr();
});

$$(document).on("click", ".paymenttypehere", function () {
    $$(".paymenttypehere").removeClass("active");
    if ($$(this).hasClass("balance-item")) {
        if (Number($$('.balance-item').data("balance")) >= Number($$('.balance-item').data("price"))) {
            $$(this).addClass("active");
        }
        else {
            var toastBottom = app.toast.create({
                text: localStorage.lang == "en" ? 'رصيدك غير كاف' : 'رصيدك غير كاف',
                closeTimeout: 2000
            });
            toastBottom.open();
        }
    }
    else {
        //$$(this).addClass("active");
        var toastBottom = app.toast.create({
            text: localStorage.lang == "en" ? 'قريباً' : 'قريباً',
            closeTimeout: 2000
        });
        toastBottom.open();
    }
});

$$(document).on("click", ".SaveOrderPaymentMethod", function () {
    if ($$(".paymenttypehere.active").length == 1) {
        app.popup.close();
        $$(mainView.router.currentPageEl).find(".paymenttype-container").html('<p class="paymentAfterSelect" data-id="' + $$(".paymenttypehere.active").data("id") + '">' + $$(".paymenttypehere.active").data("name") + '</p>');
    }
    else {
        var toastBottom = app.toast.create({
            text: localStorage.lang == "en" ? 'الرجاء التأكد من اختيار طريقة دفع' : 'الرجاء التأكد من اختيار طريقة دفع',
            closeTimeout: 2000
        });
        toastBottom.open();
    }
});

$$(document).on("click", ".SaveNewOrder", function () {
    var profilemage = $$(mainView.router.currentPageEl).find("#orderImage").attr("src");
    var OrderWeight = $$(mainView.router.currentPageEl).find(".OrderWeight").val();
    var SelectedStores = $$(mainView.router.currentPageEl).find(".SelectedStores").val();
    var PackagesTakenDate = $$(mainView.router.currentPageEl).find(".PackagesTakenDate").val();
    var ClientMobileInput = $$(mainView.router.currentPageEl).find(".ClientMobileInput").val();
    var OrderNote = $$(mainView.router.currentPageEl).find(".OrderNote").val();

    var paymentAfterSelectLength = $$(mainView.router.currentPageEl).find(".paymentAfterSelect").length;
    var paymentId = $$(mainView.router.currentPageEl).find(".paymentAfterSelect").attr("data-id");

    var orderPackageLength = $$(mainView.router.currentPageEl).find(".orderPackage-section-item").length;

    //for testing only
    profilemage = "/Areas/avatar.png";

    if (profilemage != "img/avatar.png" && OrderWeight.trim() != "" && PackagesTakenDate.trim() != "" && ClientMobileInput.trim() != "" && OrderNote.trim() != ""
        && SelectedStores != "0" && paymentAfterSelectLength == 1 && paymentId != null && orderPackageLength > 0) {
        var packagesitemsArr = [];
        for (var i = 0; i < orderPackageLength; i++) {
            packagesitemsArr.push({
                packageTypeIdFK: $$($$(mainView.router.currentPageEl).find(".orderPackage-section-item")[i]).data("packageTypeIdFK"),
                catIdFK: $$($$(mainView.router.currentPageEl).find(".orderPackage-section-item")[i]).data("catIdFK"),
            });
        }

        var data = {
            OrderImage: profilemage,
            OrderWeight: OrderWeight,
            StoreIdFk: SelectedStores,
            PackagesTakenDate: PackagesTakenDate,
            ClientPhone: ClientMobileInput,
            Notes: OrderNote,
            PaymentTypeIdFk: paymentId,
            PackagesItems: packagesitemsArr
        };

        var cr = JSON.parse(localStorage.ClientCredintial);
        if (!cr.isApproved || !cr.isCompleted) {
            var toastBottom = app.toast.create({
                text: localStorage.lang == "en" ? 'خطأ، غير مسموح انشاء طلب حالياً' : 'خطأ، غير مسموح انشاء طلب حالياً',
                closeTimeout: 2000
            });
            toastBottom.open();
            app.methods.GoToWaitingApprovePage();
            return;
        }

        app.preloader.show();
        var q = "" + app.data.hosting.ApiUrl + "/Merchant/SaveNewOrder";
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
                        text: localStorage.lang == "en" ? 'خطأ، غير مسموح انشاء طلب حالياً' : 'خطأ، غير مسموح انشاء طلب حالياً',
                        closeTimeout: 2000
                    });
                    toastBottom.open();
                    app.methods.GoToWaitingApprovePage();
                    return;
                }
                else {
                    var toastBottom = app.toast.create({
                        text: localStorage.lang == "en" ? 'Saved Successfully' : 'تم الحفظ بنجاح',
                        closeTimeout: 2000
                    });
                    toastBottom.open();

                    //SuccessOrder
                    var obj = {
                        orderNumber: e.orderNumber
                    };
                    mainView.router.navigate(
                        {
                            name: 'SuccessOrder'
                        },
                        {
                            context: {
                                ContentData: obj
                            }
                        });
                }


            }
            else if (e.sts == -1 || e.sts == -2) {
                var toastBottom = app.toast.create({
                    text: localStorage.lang == "en" ? 'خطأ، غير مسموح انشاء طلب حالياً' : 'خطأ، غير مسموح انشاء طلب حالياً',
                    closeTimeout: 2000
                });
                toastBottom.open();
                app.methods.GoToWaitingApprovePage();
            }
            else if (e.sts == -3) {
                var toastBottom = app.toast.create({
                    text: localStorage.lang == "en" ? 'الرجاء التأكد من اضافة الطرود' : 'الرجاء التأكد من اضافة الطرود',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else if (e.sts == -4) {
                var toastBottom = app.toast.create({
                    text: localStorage.lang == "en" ? 'رصيدك غير كاف' : 'رصيدك غير كاف',
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