var lockey = Math.floor((Math.random() * 10000) + 1000);
var allowInfinite_Partener_tab_new = true;//used for driver home page --- we put it here because we need this variable to be shared with app.js

//search for a value of any property in array of objects --- return index or -1
function search(propertyName, propertyValue, myArray) {
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i][propertyName] === propertyValue) {
            return i;
        }
    }
    return -1;
}

function hasWhiteSpace(s) {
    return s.indexOf(' ') >= 0;
}

//is number
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if ((charCode < 48 || charCode > 57) && charCode != 8)
        return false;
    return true;
}

//is number
function isAllNum(inputtxt) {
    var isnum = /^\d+$/.test(inputtxt);
    return isnum;
}

//Check valid KSA phone number
var validPhone = false;
function chkvalidphone() {
    var strx = $$(mainView.router.currentPageEl).find(".ClientMobileInput").val();
    var n = strx.search(/05/i);
    if (n == 0 && strx.length == 10 && (hasWhiteSpace(strx) == false) && isAllNum(strx)) {
        validPhone = true;
        $$(mainView.router.currentPageEl).find(".ClientMobileInput").css("border-color", "green");
    }
    else {
        validPhone = false;
        $$(mainView.router.currentPageEl).find(".ClientMobileInput").css("border-color", "red");
    }
}

//open link in browser for Android Or IOS
function openBrowser(link) {
    var deviceType = (navigator.userAgent.match(/iPad/i)) == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i)) == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
    if (deviceType == "iPhone" || deviceType == "iPad") {
        window.open('' + link + '', '_system');
    }
    else {
        var link = xthis;
        navigator.app.loadUrl('' + link + '', { openExternal: true });
    }
}


//Convert Seconds to days, hours, minutes and seconds
function GetTime(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);


    if (localStorage.lang == "ar") {
        var fh = "";

        if (d > 0) {
            if (d == 1)
                fh = "يوم";
            else if (d == 2)
                fh = "يومين";
            else if (d > 2 && d <= 10)
                fh = d + " أيام";
            else if (d > 10) {
                fh = d + " يوم";
            }
        }
        else if (h > 0) {
            if (h == 1)
                fh = "ساعة";
            else if (h == 2)
                fh = "ساعتين";
            else if (h > 2 && h <= 10)
                fh = h + " ساعات";
            else if (h > 10) {
                fh = h + " ساعة";
            }
        }
        else if (m > 0) {
            if (m == 1)
                fh = "دقيقة";
            else if (m == 2)
                fh = "دقيقتين";
            else if (m > 2 && m <= 10)
                fh = m + " دقائق";
            else if (m > 10) {
                fh = m + " دقيقة";
            }
        }
        else if (s > 0) {
            if (s == 1)
                fh = "ثانية";
            else if (s == 2)
                fh = "ثانيتين";
            else if (s > 2 && s <= 10)
                fh = s + " ثوان";
            else if (s > 10) {
                fh = s + " ثانية";
            }
        }

        return fh;
    }
    else {
        if (d > 0) {
            if (d == 1)
                fh = "day";
            else {
                fh = d + " days";
            }
        }
        else if (h > 0) {
            if (h == 1)
                fh = "hour";
            else {
                fh = h + " hours";
            }
        }
        else if (m > 0) {
            if (m == 1)
                fh = "minute";
            else {
                fh = m + " minutes";
            }
        }
        else if (s > 0) {
            if (s == 1)
                fh = "second";
            else {
                fh = s + " seconds";
            }
        }

        return fh;
    }
}
function GetTimeAsHtml(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);

    var fhAr = "";
    var fhEn = "";

    if (d > 0) {
        if (d == 1)
            fhAr = "يوم";
        else if (d == 2)
            fhAr = "يومين";
        else if (d > 2 && d <= 10)
            fhAr = d + " أيام";
        else if (d > 10) {
            fhAr = d + " يوم";
        }
    }
    else if (h > 0) {
        if (h == 1)
            fhAr = "ساعة";
        else if (h == 2)
            fhAr = "ساعتين";
        else if (h > 2 && h <= 10)
            fhAr = h + " ساعات";
        else if (h > 10) {
            fhAr = h + " ساعة";
        }
    }
    else if (m > 0) {
        if (m == 1)
            fhAr = "دقيقة";
        else if (m == 2)
            fhAr = "دقيقتين";
        else if (m > 2 && m <= 10)
            fhAr = m + " دقائق";
        else if (m > 10) {
            fhAr = m + " دقيقة";
        }
    }
    else if (s > 0) {
        if (s == 1)
            fhAr = "ثانية";
        else if (s == 2)
            fhAr = "ثانيتين";
        else if (s > 2 && s <= 10)
            fhAr = s + " ثوان";
        else if (s > 10) {
            fhAr = s + " ثانية";
        }
    }

    if (d > 0) {
        if (d == 1)
            fhEn = "day";
        else {
            fhEn = d + " days";
        }
    }
    else if (h > 0) {
        if (h == 1)
            fhEn = "hour";
        else {
            fhEn = h + " hours";
        }
    }
    else if (m > 0) {
        if (m == 1)
            fhEn = "minute";
        else {
            fhEn = m + " minutes";
        }
    }
    else if (s > 0) {
        if (s == 1)
            fhEn = "second";
        else {
            fhEn = s + " seconds";
        }
    }

    var result = '<div class="ChangeLang" style="display:contents" data-ar=" ' + fhAr + '" data-en="' + fhEn + '"></div>';
    return result;
}


//Upload Single file for android or ios
//this is for crop image, image picker, file and file transfer
//<plugin name="cordova-plugin-file" source="npm" spec="~4.1.1" />
//<plugin name="cordova-plugin-file-transfer" source="npm" spec="~1.5.1" />
//<plugin name="cordova-plugin-k-imagecropper" source="npm" spec="~1.1.7" />
//<plugin name="cordova-plugin-matisse-imagepicker" source="npm"  />
function ChooseSinglePicture(eleAttrId, NeedToCrop) {
    try {
        navigator.camera.getPicture(function (imageURI) {
            uploaduserimageprofileCorp(imageURI, eleAttrId, NeedToCrop);
        }, function (message) {
            if (localStorage.lang == "en") {
                var toastBottom = app.toast.create({
                    text: 'No picture selected',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else {
                var toastBottom = app.toast.create({
                    text: 'لم تختر اي صورة',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
        }, {
            correctOrientation: true,
            targetWidth: 828,
            targetHeight: 428,
            quality: 100,
            destinationType: navigator.camera.DestinationType.FILE_URI,
            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
        });
    } catch (e) {
        if (localStorage.lang == "en") {
            var toastBottom = app.toast.create({
                text: 'Error, try again later',
                closeTimeout: 2000
            });
            toastBottom.open();
        }
        else {
            var toastBottom = app.toast.create({
                text: 'حدث خطأ، حاول مجدداً لاحقاً',
                closeTimeout: 2000
            });
            toastBottom.open();
        }
    }
}
function uploaduserimageprofileCorp(imageURI, eleAttrId, NeedToCrop) {
    if (NeedToCrop == true) {
        try {
            var options = {
                url: imageURI,              // required.
                ratio: "2/2",               // optional. (here you can define your custom ration) default: 1:1
                autoZoomEnabled: false      // optional. android only. for iOS its always true (if it is true then cropper will automatically adjust the view) default: true
            }
            window.plugins.k.imagecropper.open(options, function (data) {
                var newPath = data.imgPath;
                try {
                    var options = { dimBackground: true };
                    app.preloader.show();
                } catch (e) {
                    alert("error");
                }
                try {
                    var options = new FileUploadOptions();
                    options.fileKey = "ProfileFile";
                    var imagefilename = Number(new Date()) + ".jpg";
                    options.fileName = imagefilename;
                    options.mimeType = "image/jpeg";
                    var params = new Object();
                    var ft = new FileTransfer();
                    var url = app.data.hosting.ApiUrl + '/FileUploads/Create';
                    //alert("url prepared");
                    ft.upload(newPath, encodeURI(url), function (r) {
                        //alert("success");
                        winprofileCorp(r, eleAttrId);
                    }, failprofileCorp, options);
                } catch (err) {
                    if (localStorage.lang == "en") {
                        var toastBottom = app.toast.create({
                            text: 'Error, try again later',
                            closeTimeout: 2000
                        });
                        toastBottom.open();
                    }
                    else {
                        var toastBottom = app.toast.create({
                            text: 'حدث خطأ، حاول مجدداً لاحقاً',
                            closeTimeout: 2000
                        });
                        toastBottom.open();
                    }
                }
            }, function (error) {
                if (localStorage.lang == "en") {
                    var toastBottom = app.toast.create({
                        text: 'No picture selected',
                        closeTimeout: 2000
                    });
                    toastBottom.open();
                }
                else {
                    var toastBottom = app.toast.create({
                        text: 'لم تختر اي صورة',
                        closeTimeout: 2000
                    });
                    toastBottom.open();
                }
            });
        } catch (e) {
            if (localStorage.lang == "en") {
                var toastBottom = app.toast.create({
                    text: 'Error, try again later',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else {
                var toastBottom = app.toast.create({
                    text: 'حدث خطأ، حاول مجدداً لاحقاً',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
        }
    }
    else {
        try {
            var options = { dimBackground: true };
            app.preloader.show();
        } catch (e) {
            alert("error");
        }
        try {
            var newPath = imageURI;
            var options = new FileUploadOptions();
            options.fileKey = "ProfileFile";
            var imagefilename = Number(new Date()) + ".jpg";
            options.fileName = imagefilename;
            options.mimeType = "image/jpeg";
            var params = new Object();
            var ft = new FileTransfer();
            var url = app.data.hosting.ApiUrl + '/FileUploads/Create';
            ft.upload(newPath, encodeURI(url), function (r) {
                winprofileCorp(r, eleAttrId);
            }, failprofileCorp, options);
        } catch (err) {
            if (localStorage.lang == "en") {
                var toastBottom = app.toast.create({
                    text: 'Error, try again later',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else {
                var toastBottom = app.toast.create({
                    text: 'حدث خطأ، حاول مجدداً لاحقاً',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
        }
    }
}
function winprofileCorp(r, eleAttrId) {
    try {
        app.preloader.hide();
        //alert("Response =" + r.response);
        //alert("Sent =" + r.bytesSent);
        var srcimage = r.response;
        //alert(srcimage);
        if (srcimage != "") {
            $$(mainView.router.currentPageEl).find("#" + eleAttrId).attr("src", srcimage);
            if (localStorage.lang == "en") {
                var toastBottom = app.toast.create({
                    text: 'تم رفع الصورة بنجاح',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else {
                var toastBottom = app.toast.create({
                    text: 'تم رفع الصورة بنجاح',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
        }
        else {
            if (localStorage.lang == "en") {
                var toastBottom = app.toast.create({
                    text: 'Error, try again later',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
            else {
                var toastBottom = app.toast.create({
                    text: 'حدث خطأ، حاول مجدداً لاحقاً',
                    closeTimeout: 2000
                });
                toastBottom.open();
            }
        }
    } catch (zz) {
        alert(zz)
    }
    try {
        app.preloader.hide();
    } catch (e) {

    }
}
function failprofileCorp(Error) {
    try {
        app.preloader.hide();
    } catch (e) {

    }
    if (localStorage.lang == "en") {
        var toastBottom = app.toast.create({
            text: 'Error, try again later',
            closeTimeout: 2000
        });
        toastBottom.open();
    }
    else {
        var toastBottom = app.toast.create({
            text: 'حدث خطأ، حاول مجدداً لاحقاً',
            closeTimeout: 2000
        });
        toastBottom.open();
    }
    alert("#Error upload source" + Error.source);
}

