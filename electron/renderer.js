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


$('.message a').click(function(){
    $('form').animate({height: "toggle", opacity: "toggle"}, "medium");
});

$('#btn-signup').click(function () {
    console.log("hehehe")
    firebase.auth().createUserWithEmailAndPassword($('#signup-email').val(), $('#signup-password').val()).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("hehehe")
        console.log(errorMessage)

    });
})