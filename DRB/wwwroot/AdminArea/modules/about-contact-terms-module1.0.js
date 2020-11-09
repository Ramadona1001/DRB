function formsubmit() {
    if ($(".DESCAR").val().trim() != "" && $(".DESCAR2").val().trim() != "") {
        $("#LogForm").submit();
    }
    else
        swal("", "الرجاء التحقق من تعبئة جميع الحقول");
}

function formsubmitContact() {
    if ($(".AR3").val().trim() != "" && $(".AR4").val().trim() != "" && $(".AR5").val().trim() != "") {
        $("#LogForm").submit();
    }
    else
        swal("", "الرجاء التحقق من تعبئة جميع الحقول");
}


function formsubmitTerms() {
    if ($(".AR1").val().trim() != "") {
        $("#LogForm").submit();
    }
    else {
        swal("", "الرجاء التحقق من تعبئة جميع الحقول");
    }
}

function formsubmitStrings() {
    if ($(".AR3").val().trim() != "" && $(".AR4").val().trim() != "" && $(".AR5").val().trim() != "" && $(".AR6").val().trim() != "") {
        $("#LogForm").submit();
    }
    else
        swal("", "الرجاء التحقق من تعبئة جميع الحقول");
}