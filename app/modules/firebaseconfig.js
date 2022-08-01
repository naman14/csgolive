let config = {
    apiKey: "AIzaSyCWnIJ84XMljtxHEmZ4N4mkj-u36vxH7sQ",
    authDomain: "csgolive-b4b34.firebaseapp.com",
    databaseURL: "https://csgolive-b4b34.firebaseio.com/",
    storageBucket: "csgolive-b4b34.appspot.com"
};

var firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');
require('firebase/storage');

var firebaseapp = firebase.initializeApp(config);
exports.firebaseapp = firebaseapp

