// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

let $ = require('jQuery');

let firebase = require("firebase");

let config = {
    apiKey: "AIzaSyCWnIJ84XMljtxHEmZ4N4mkj-u36vxH7sQ",
    authDomain: "csgolive-b4b34.firebaseapp.com",
    databaseURL: "https://csgolive-b4b34.firebaseio.com/",
};
firebase.initializeApp(config);


$('.message a').click(function () {
    $('#form1').animate({height: "toggle", opacity: "toggle"}, "medium");
    $('#form2').animate({height: "toggle", opacity: "toggle"}, "medium");
});

$('#btn-signup').click(function () {

    $('#loading').show()
    $('.message').hide()

    firebase.auth().createUserWithEmailAndPassword($('#signup-email').val(), $('#signup-password').val())
        .then(function (user) {

            firebase.database().ref('/users/' + uid).set({
                email: user.email,
                uid: user.uid
            }).catch(function (error) {
                showToast("Error. Login to complete user creation")
            }).then(function () {
                localStorage.setItem("email", user.email)
                localStorage.setItem("uid", user.uid)
            });

        })
        .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage)

            $('#loading').hide()

            showToast(errorMessage)

        });
})

$('#btn-login').click(function () {

    $('#loading').show()
    $('.message').hide()

    firebase.auth().signInWithEmailAndPassword($('#login-email').val(), $('#login-password').val())
        .then(function (user) {
            console.log(user.email)

            firebase.database().ref('/users/' + user.uid).once('value').then(function (snapshot) {

                let userData = snapshot.val()

                if (userData) {
                    localStorage.setItem("email", user.email)
                    localStorage.setItem("uid", user.uid)
                } else {
                    firebase.database().ref('/users/' + uid).set({
                        email: user.email,
                        uid: user.uid
                    }).catch(function (error) {
                        showToast("Error occurred.")
                    }).then(function () {
                        localStorage.setItem("email", user.email)
                        localStorage.setItem("uid", user.uid)
                    });
                }
            });



        })
        .catch(function (error) {
            var errorCode = error.code
            var errorMessage = error.message;
            console.log(errorMessage)

            $('#loading').hide()
            showToast(errorMessage)

        });

})

function showToast(message) {
    var snackbarContainer = document.querySelector('#status-toast');
    var data = {message: message, timeout: 5000};
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
}

