var maploaded = false;
function initMapload() {
    maploaded = true;
}

var map;
var bounds;
function initMap(objctArr) {
    //if ($$(mainView.router.currentPageEl).find(".map").length > 1) {
    //    $$(mainView.router.currentPageEl).find(".map")[0].remove();
    //}
    $$(mainView.router.currentPageEl).find(".map").html('');
    if (objctArr == null || objctArr.length == 0) {
        var po = { lat: parseFloat("24.78523"), lng: parseFloat("46.6869141") };

        map = new google.maps.Map(document.querySelector(".page-current .map"), {
            center: po,
            zoom: 10,
            //mapTypeControl: false,
            //streetViewControl: false,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
    }
    else {
        var po = { lat: parseFloat(objctArr[0].lat), lng: parseFloat(objctArr[0].lng) };

        map = new google.maps.Map(document.querySelector(".page-current .map"), {
            center: po,
            zoom: 10,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < objctArr.length; i++) {
            addMarker(objctArr[i]);
        }
        map.fitBounds(bounds);
    }
}
function addMarker(obj) {
    var po = { lat: parseFloat(obj.lat), lng: parseFloat(obj.lng) };
    var myIcon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";

    var marker = new google.maps.Marker({
        position: po,
        map: map,
        title: obj.orderNumber,
        icon: {
            url: myIcon
        }
    });
    bounds.extend(marker.position);
    google.maps.event.addListener(marker, 'click', function () {
        //get order details redirect to order page or do any thing here
    });
}
