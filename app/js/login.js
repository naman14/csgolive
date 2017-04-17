// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

let $ = require('jQuery');

let firebaseapp = require('./../modules/firebaseconfig').firebaseapp

const ipc = require('electron').ipcRenderer

let domain = "@csgolive.com";


$('.message a').click(function () {
    $('#form1').animate({height: "toggle", opacity: "toggle"}, "medium");
    $('#form2').animate({height: "toggle", opacity: "toggle"}, "medium");
});

$('#btn-signup').click(function () {

    $('#loading').show()
    $('.message').hide()

    firebaseapp.auth().createUserWithEmailAndPassword($('#signup-email').val() + domain, $('#signup-password').val())
        .then(function (user) {

            let username = user.email.replace(domain, '');
            firebaseapp.database().ref('/users/' + username).set({
                email: user.email,
                uid: user.uid,
                username: username
            }).catch(function (error) {
                $('#loading').hide()
                showToast("Error. Login to complete user creation")
            }).then(function () {
                $('#loading').hide()
                localStorage.setItem("email", user.email);
                localStorage.setItem("uid", user.uid);
                localStorage.setItem("username", username);
                moveNext()
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

    firebaseapp.auth().signInWithEmailAndPassword($('#login-email').val()+ domain, $('#login-password').val())
        .then(function (user) {

            let username = user.email.replace(domain, '');

            firebaseapp.database().ref('/users/' + username).once('value').then(function (snapshot) {

                let userData = snapshot.val()

                if (userData) {
                    localStorage.setItem("email", user.email)
                    localStorage.setItem("uid", user.uid)
                    localStorage.setItem("username", username);
                    moveNext()
                } else {
                    firebaseapp.database().ref('/users/' + username).set({
                        email: user.email,
                        uid: user.uid,
                        username: username
                    }).catch(function (error) {
                        showToast("Error occurred.")
                    }).then(function () {
                        localStorage.setItem("email", user.email)
                        localStorage.setItem("uid", user.uid)
                        localStorage.setItem("username", username);
                        moveNext()
                    });
                }
            });



        })
        .catch(function (error) {
            var errorCode = error.code
            var errorMessage = error.message;
            console.log(errorMessage)

            $('#loading').hide()
            $('.message').show()
            showToast(errorMessage)

        });

})

function showToast(message) {
    var snackbarContainer = document.querySelector('#status-toast');
    var data = {message: message, timeout: 5000};
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
}

function moveNext() {
    location.href = "home.html"
}

