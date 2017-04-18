/**
 * Created by naman on 17/4/17.
 */

let $ = require('jQuery');

let firebaseapp = require('./../../modules/firebaseconfig').firebaseapp

function updateFirebase(data) {

    let username = localStorage.getItem('username');

    if(username == null) {
        console.log("username undefined, aborting..")
        return;
    }

    let database = firebaseapp.database();

    database.ref('/users/' + username).child("live").set(data)
        .catch(function (error) {
            console.log(error);
        }).then(function () {

    });
}

function saveGameToFirebase(data) {
    let username = localStorage.getItem('username');

    if(username == null) {
        console.log("username undefined, aborting..")
        return;
    }

    let database = firebaseapp.database();

    database.ref('/users/' + username).child("games").push().set(data)
        .catch(function (error) {
            console.log(error);
        }).then(function () {

    });
}

exports.updateFirebase = updateFirebase;
exports.saveGameToFirebase = saveGameToFirebase;
