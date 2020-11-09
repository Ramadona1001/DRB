$(document).on("click", "#logbtn", function (e) {
    e.preventDefault();

    var email = $("#UserNameID").val();
    var password = $("#PasswordID").val();

    if (email.trim() != "" && password.trim() != "") {
        $('#loginForm').submit();
    }
});

