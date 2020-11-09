var loadedlists = false;
$$(document).on("page:afterin", '.page[data-name="merchantcompletedata"]', function () {
    app.methods.GetAllCatsCachedBeforeLoadPage("SelectedCat", false);
    app.methods.GetAllPackageTypesCachedBeforeLoadPage("SelectedPackageSize");

    //load data with other 2 drop
    var getDrop = false;
    if (!sessionStorage.allTimes || !sessionStorage.allOrdersNum) {
        getDrop = true;
    }
    else {
        app.methods.GetAllPreparedTimesCachedBeforeLoadPage();
        app.methods.GetAllDailyNumOrdersCachedBeforeLoadPage();
    }

    q = "" + app.data.hosting.ApiUrl + "/Merchant/GetMerchantCompleteData?getDrop=" + getDrop;

    app.methods.MakaAjaxCall(q, "GET", null, function (e) {
        e = JSON.parse(e);

        if (e.allTimes != null)
            sessionStorage.allTimes = JSON.stringify(e.allTimes);
        if (e.allOrdersNum != null)
            sessionStorage.allOrdersNum = JSON.stringify(e.allOrdersNum);

        if (getDrop) {
            app.methods.GetAllPreparedTimesCachedBeforeLoadPage();
            app.methods.GetAllDailyNumOrdersCachedBeforeLoadPage();
        }

        if (e.clientData != null) {
            $$(mainView.router.currentPageEl).find(".loader-holder").hide();
            $$(mainView.router.currentPageEl).find(".main-holder").show();

            if (e.storesTbModel != null) {
                //bind Saved Stores
                var html = app.StoresSectionTemplate({ FAQs: e.storesTbModel, FAQsPackages: null });
                $$(mainView.router.currentPageEl).find(".stores-list-container").html(html);
                sessionStorage.stores = JSON.stringify(e.storesTbModel);
            }
            if (e.clientData.merchantName != null) {
                $$(mainView.router.currentPageEl).find(".FullName").val(e.clientData.merchantName);
            }
            if (e.clientData.merchantDailyNumOfOrdersId != null) {
                $$(mainView.router.currentPageEl).find(".SelectedNumOfDailyOrders").val(e.clientData.merchantDailyNumOfOrdersId);
            }
            if (e.clientData.merchantPackageSizeId != null) {
                $$(mainView.router.currentPageEl).find(".SelectedPackageSize").val(e.clientData.merchantPackageSizeId);
            }
            if (e.clientData.merchantPackagePerpTimesId != null) {
                $$(mainView.router.currentPageEl).find(".SelectedPrepaedTimes").val(e.clientData.merchantPackagePerpTimesId);
            }
            if (e.clientData.merchantCommercialNum != null) {
                $$(mainView.router.currentPageEl).find(".CommercialNum").val(e.clientData.merchantCommercialNum);
            }
            if (e.clientData.merchantCatsArr != null) {
                var smartSelect = app.smartSelect.get($$(mainView.router.currentPageEl).find(".smart-select-cats"));
                smartSelect.setValue(e.clientData.merchantCatsArr);
            }
        }
    },
        function (error) {

        });

});

$$(document).on("click", ".goToAddStorePopup", function () {
    lockey = Math.floor((Math.random() * 10000) + 1000);
    var html = app.MapPopupTemplate({ id: 0 });
    var dynamicPopup = app.popup.create({
        content: html,
        closeByBackdropClick: true,
        on: {
            open: function (popup) {
                //init or change map here 
                latitude = "24.78523";
                longitude = "46.6869141";
                var location = latitude + "," + longitude;
                document.getElementById('Mymap').src = "https://maps.dizzlr.co/map.aspx?set=yes&location=" + location + "&key=" + lockey + "&MapsKey=AIzaSyDWfNs9qtoiVLuXE8TPv-Hg3IvyVDxX0nc";
                app.methods.GetAllCitiesCachedBeforeSign();
            }
        }
    });
    dynamicPopup.open();
    app.methods.ChangeLangFromDataAttr();
});

$$(document).on("click", ".edit-store", function () {
    lockey = Math.floor((Math.random() * 10000) + 1000);
    var id = $$(this).data("id");
    var address = $$($$(this).parent().parent()).data("address");
    var nameAr = $$($$(this).parent().parent()).data("nameAr");
    var cityid = $$($$(this).parent().parent()).data("cityid");
    var lat = $$($$(this).parent().parent()).data("lat");
    var lng = $$($$(this).parent().parent()).data("lng");

    var html = app.MapPopupTemplate({ id: id });
    var dynamicPopup = app.popup.create({
        content: html,
        closeByBackdropClick: true,
        on: {
            open: function (popup) {
                //init or change map here 
                latitude = lat;
                longitude = lng;
                var location = latitude + "," + longitude;
                document.getElementById('Mymap').src = "https://maps.dizzlr.co/map.aspx?set=yes&location=" + location + "&key=" + lockey + "&MapsKey=AIzaSyDWfNs9qtoiVLuXE8TPv-Hg3IvyVDxX0nc";
                $$(".myMapPopup").find(".StoreFullName").val(nameAr);
                $$(".myMapPopup").find(".StoreAddress").val(address);
                app.methods.GetAllCitiesCachedBeforeSign();
                $$(".myMapPopup").find(".SelectedCity").val(cityid);
            }
        }
    });
    dynamicPopup.open();
    app.methods.ChangeLangFromDataAttr();
    $$(".myMapPopup").find(".SelectedCity").val(cityid);
});

$$(document).on("click", ".SaveStoreBtn", function () {
    var id = $$(this).data("id");
    var StoreFullName = $$(".myMapPopup").find(".StoreFullName").val();
    var StoreAddress = $$(".myMapPopup").find(".StoreAddress").val();
    var StoreCityId = $$(".myMapPopup").find(".SelectedCity").val();
    if (StoreFullName.trim() != "" && StoreAddress.trim() != "" && StoreCityId != "0") {
        app.preloader.show();
        app.request({
            url: "https://maps.dizzlr.co/map.aspx?getLocationString=" + lockey + "",
            type: 'GET',
            data: {},
            success: function (responseText) {

                var str = responseText.split(',');

                if (Number(id) > 0) { //edit
                    if ((str[0] == "" && str[1] == undefined) || responseText == "") {
                        var lt = $$(mainView.router.currentPageEl).find(".store-section-item[data-id='" + id + "']").attr("data-lat");
                        var lg = $$(mainView.router.currentPageEl).find(".store-section-item[data-id='" + id + "']").attr("data-lng");
                        responseText = "" + lt + "," + lg;
                        str = responseText.split(',');
                    }
                }

                if (str[0] == "" && str[1] == undefined) {
                    app.preloader.hide();
                    app.methods.AlertCanotGetLatLng();
                }
                else {

                    var eee = document.getElementById("mapcity");
                    var cityName = $$($$("#mapcity").find("option")[eee.selectedIndex]).html();
                    if (Number(id) == 0) {

                        //get store html
                        var obj = {
                            nameAr: StoreFullName,
                            cityId: StoreCityId,
                            cityName: cityName,
                            address: StoreAddress,
                            lat: str[0],
                            lng: str[1],
                            id: 0
                        }

                        var q = "" + app.data.hosting.ApiUrl + "/Merchant/AddStore";
                        app.methods.MakaAjaxCall(q, "POST", obj, function (e) {
                            e = JSON.parse(e);
                            app.preloader.hide();
                            if (e.id > 0) {
                                obj.id = e.id;
                                app.popup.close();
                                var html = app.StoresSectionTemplate({ FAQs: [obj], FAQsPackages: null });
                                $$(mainView.router.currentPageEl).find(".stores-list-container").append(html);

                                var toastBottom = app.toast.create({
                                    text: localStorage.lang == "en" ? 'Saved Successfully' : 'تم الحفظ بنجاح',
                                    closeTimeout: 2000
                                });
                                toastBottom.open();

                                if (sessionStorage.stores) {
                                    var storesList = JSON.parse(sessionStorage.stores);
                                    if (storesList != null) {
                                        storesList.push(obj);
                                        sessionStorage.stores = JSON.stringify(storesList);
                                    }
                                    else {
                                        storesList = [obj];
                                        sessionStorage.stores = JSON.stringify(storesList);
                                    }
                                }
                                else {
                                    storesList = [obj];
                                    sessionStorage.stores = JSON.stringify(storesList);
                                }

                            }
                            else if (e.id == -1) {
                                var toastBottom = app.toast.create({
                                    text: localStorage.lang == "en" ? 'Error, try again later' : 'خطأ، هذا الاسم موجود من قبل',
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
                    else { //edit on server

                        var data = {
                            nameAr: StoreFullName,
                            cityId: StoreCityId,
                            address: StoreAddress,
                            lat: str[0],
                            lng: str[1],
                            id: id
                        }
                        var q = "" + app.data.hosting.ApiUrl + "/Merchant/EditStore";
                        app.methods.MakaAjaxCall(q, "POST", data, function (e) {
                            e = JSON.parse(e);
                            app.preloader.hide();
                            if (e == 1) {
                                app.popup.close();
                                data.cityName = cityName;
                                $$(mainView.router.currentPageEl).find(".store-section-item[data-id='" + id + "']").attr("data-address", StoreAddress);
                                $$(mainView.router.currentPageEl).find(".store-section-item[data-id='" + id + "']").attr("data-nameAr", StoreFullName);
                                $$(mainView.router.currentPageEl).find(".store-section-item[data-id='" + id + "']").attr("data-cityid", StoreCityId);
                                $$(mainView.router.currentPageEl).find(".store-section-item[data-id='" + id + "']").attr("data-lat", str[0]);
                                $$(mainView.router.currentPageEl).find(".store-section-item[data-id='" + id + "']").attr("data-lng", str[1]);

                                $$(mainView.router.currentPageEl).find(".store-section-item[data-id='" + id + "']").find(".store-cat").html(StoreFullName);
                                $$(mainView.router.currentPageEl).find(".store-section-item[data-id='" + id + "']").find(".store-name").html(cityName);
                                $$(mainView.router.currentPageEl).find(".store-section-item[data-id='" + id + "']").find(".store-date").html(StoreAddress);

                                var toastBottom = app.toast.create({
                                    text: localStorage.lang == "en" ? 'Saved Successfully' : 'تم الحفظ بنجاح',
                                    closeTimeout: 2000
                                });
                                toastBottom.open();

                                if (sessionStorage.stores) {
                                    var storesList = JSON.parse(sessionStorage.stores);
                                    if (storesList != null && storesList.length > 0) {
                                        storesList = storesList.filter(p => p.id != data.id);
                                        storesList.push(data);
                                        sessionStorage.stores = JSON.stringify(storesList);
                                    }
                                    else {
                                        storesList = [data];
                                        sessionStorage.stores = JSON.stringify(storesList);
                                    }
                                }
                                else {
                                    storesList = [data];
                                    sessionStorage.stores = JSON.stringify(storesList);
                                }

                            }
                            else if (e == -1) {
                                var toastBottom = app.toast.create({
                                    text: localStorage.lang == "en" ? 'Error, try again later' : 'خطأ، هذا المستودع غير موجود',
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
                }
            },
            error: function () {
                app.preloader.hide();
                app.methods.AlertCanotGetLatLng();
            }
        });

    }
    else {
        app.methods.AlertMissingFields();
    }
});

$$(document).on("click", ".delete-store", function () {
    var id = $$(this).data("id");

    var parentToDelete = $$(this).parent().parent();

    var t1 = "هل أنت متأكد؟";
    var t2 = "درب";
    if (localStorage.lang == "en") {
        t1 = "Are you sure?";
        t2 = "DRB"
    }
    app.dialog.confirm(t1, t2, function () {
        var data = {
            id: id
        }
        app.preloader.show();
        var q = "" + app.data.hosting.ApiUrl + "/Merchant/DeleteStore";
        app.methods.MakaAjaxCall(q, "POST", data, function (e) {
            e = JSON.parse(e);
            app.preloader.hide();
            if (e == 1) {

                $$(parentToDelete).remove();

                var toastBottom = app.toast.create({
                    text: localStorage.lang == "en" ? 'Deleted Successfully' : 'تم الحذف بنجاح',
                    closeTimeout: 2000
                });
                toastBottom.open();

                if (sessionStorage.stores) {
                    var storesList = JSON.parse(sessionStorage.stores);
                    if (storesList != null && storesList.length > 0) {
                        storesList = storesList.filter(p => p.id != data.id);
                        sessionStorage.stores = JSON.stringify(storesList);
                    }
                }

            }
            else if (e == -1) {
                var toastBottom = app.toast.create({
                    text: localStorage.lang == "en" ? 'Error, try again later' : 'خطأ، هذا المستودع غير موجود',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else if (e == -2) {
                var toastBottom = app.toast.create({
                    text: localStorage.lang == "en" ? 'Error, try again later' : 'خطأ، الحذف غير متاح لوجود المستودع في طلبات جارية',
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
    });
});

$$(document).on("click", ".SaveMerchantCompleteData", function () {
    var MerchantName = $$(mainView.router.currentPageEl).find(".FullName").val();

    var smartSelect = app.smartSelect.get($$(mainView.router.currentPageEl).find(".smart-select-cats"));
    var cats = smartSelect.getValue();

    var SelectedNumOfDailyOrders = $$(mainView.router.currentPageEl).find(".SelectedNumOfDailyOrders").val();
    var SelectedPackageSize = $$(mainView.router.currentPageEl).find(".SelectedPackageSize").val();
    var SelectedPrepaedTimes = $$(mainView.router.currentPageEl).find(".SelectedPrepaedTimes").val();
    var CommercialNum = $$(mainView.router.currentPageEl).find(".CommercialNum").val();
    var StoresList = $$(mainView.router.currentPageEl).find(".store-section-item").length;

    if (MerchantName.trim() != "" && cats.length > 0 && SelectedNumOfDailyOrders != "0" && SelectedPackageSize != "0"
        && SelectedPrepaedTimes != "0" && CommercialNum.trim() != "") {
        if (StoresList > 0) {
            var data = {
                MerchantName: MerchantName,
                MerchantCats: cats.toString(),
                MerchantDailyNumOfOrdersId: SelectedNumOfDailyOrders,
                MerchantPackagePerpTimesId: SelectedPrepaedTimes,
                MerchantPackageSizeId: SelectedPackageSize,
                MerchantCommercialNum: CommercialNum
            };
            app.preloader.show();
            var q = "" + app.data.hosting.ApiUrl + "/Merchant/SaveMerchantCompleteData";
            app.methods.MakaAjaxCall(q, "POST", data, function (e) {
                e = JSON.parse(e);
                app.preloader.hide();
                if (e != null && e.clientData != null && e.clientData.isCompleted) {

                    var toastBottom = app.toast.create({
                        text: localStorage.lang == "en" ? 'Saved Successfully' : 'تم الحفظ بنجاح',
                        closeTimeout: 2000
                    });
                    toastBottom.open();

                    var cr = JSON.parse(localStorage.ClientCredintial);
                    cr.isCompleted = e.clientData.isCompleted;
                    cr.isApproved = e.clientData.isApproved;
                    localStorage.ClientCredintial = JSON.stringify(cr);


                    if (e.storesTbModel != null) {
                        sessionStorage.stores = JSON.stringify(e.storesTbModel);
                    }

                    if (!e.clientData.isApproved || !e.clientData.isCompleted) {
                        app.methods.GoToWaitingApprovePage();
                    }
                    else {
                        mainView.router.navigate(
                            {
                                name: 'index'
                            },
                            {
                                transition: 'f7-circle',
                            });
                    }
                }
                else if (e.id == -1) {
                    var toastBottom = app.toast.create({
                        text: localStorage.lang == "en" ? 'Error, try again later' : 'خطأ، هذا الاسم موجود من قبل',
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
            var toastBottom = app.toast.create({
                text: localStorage.lang == "en" ? 'Deleted Successfully' : 'الرجاء التأكد من اضافة مستودع',
                closeTimeout: 2000
            });
            toastBottom.open();
        }
    }
    else {
        app.methods.AlertMissingFields();
    }
});


//------------------ driver save complete data
$$(document).on("click", ".SaveMapCircleBtn", function () {
    app.preloader.show();
    app.request({
        url: "https://maps.dizzlr.co/circule.aspx?getLocationString=" + lockey + "",
        type: 'GET',
        data: {},
        success: function (responseText) {

            var cr = "";
            if (localStorage.ClientCredintial) {
                cr = JSON.parse(localStorage.ClientCredintial);
                if (cr.isActive == true) {
                    type = cr.typeIdFk;
                }
            }

            var lat = cr.lat;
            var lng = cr.lng;
            var circle = cr.circleKm;


            if (responseText == "" && (lat == null || lat == 0)) {
                app.preloader.hide();
                app.methods.AlertCanotGetLatLngCircle();
            }
            else {

                if (responseText == "") {
                    responseText = "" + lat + "," + lng + "," + Number(circle);
                }

                responseText = responseText.replace('Position:', '');
                responseText = responseText.replace('distance:', '');
                var strArr = responseText.split(',');
                lat = strArr[0].trim();
                lng = strArr[1].trim();
                circle = (Number(strArr[2].trim())).toString();

                //get store html
                var obj = {
                    DriverCenterLat: lat,
                    DriverCenterLng: lng,
                    DriverCircleDistanceKm: circle
                }

                var q = "" + app.data.hosting.ApiUrl + "/Driver/SaveDriverCompleteData";
                app.methods.MakaAjaxCall(q, "POST", obj, function (e) {
                    e = JSON.parse(e);
                    app.preloader.hide();
                    if (e != null && e.clientData != null && e.clientData.isCompleted) {
                        app.popup.close();
                        var toastBottom = app.toast.create({
                            text: localStorage.lang == "en" ? 'Saved Successfully' : 'تم الحفظ بنجاح',
                            closeTimeout: 2000
                        });
                        toastBottom.open();

                        var cr = JSON.parse(localStorage.ClientCredintial);
                        cr.isCompleted = e.clientData.isCompleted;
                        cr.isApproved = e.clientData.isApproved;
                        cr.lat = e.clientData.driverCenterLat;
                        cr.lng = e.clientData.driverCenterLng;
                        cr.circleKm = e.clientData.driverCircleDistanceKm;
                        localStorage.ClientCredintial = JSON.stringify(cr);


                        if (!e.clientData.isCompleted) {
                            if ($$(mainView.router.currentPageEl).find(".changeTitle2").length == 0) {
                                app.methods.GoToWaitingApprovePage();
                            }
                        }
                        else if (!e.clientData.isApproved) {
                            if ($$(mainView.router.currentPageEl).find(".changeTitle2").length == 1) {
                                $$(mainView.router.currentPageEl).find(".changeTitle2").html('حسابك قيد المراجعة من قبل الادارة، وسيتم تنبيهك بعد اعتماد الحساب');
                                $$(mainView.router.currentPageEl).find(".btnhomeOrCompleteChng").html('الصفحة الرئيسية');
                                $$(mainView.router.currentPageEl).find(".btnhomeOrCompleteChng").removeClass("GoToCompleteProfile");
                                $$(mainView.router.currentPageEl).find(".btnhomeOrCompleteChng").removeClass("GoToHomePageAnimated");
                            }
                            else {
                                app.methods.GoToWaitingApprovePage();
                            }
                        }
                        else {
                            mainView.router.navigate(
                                {
                                    name: 'index'
                                },
                                {
                                    transition: 'f7-circle',
                                });
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
        },
        error: function () {
            app.preloader.hide();
            app.methods.AlertCanotGetLatLngCircle();
        }
    });
});



