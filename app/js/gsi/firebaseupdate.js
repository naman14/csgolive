/**
 * Created by naman on 17/4/17.
 */

let $ = require('jQuery');

let firebaseapp = require('./../../modules/firebaseconfig').firebaseapp

function updateFirebase(data) {

    let uid = localStorage.getItem('uid');

    if(uid == null) {
        console.log("uid undefined, aborting..")
        return;
    }

    let database = firebaseapp.database();

    database.ref('/users/' + uid).child("live").set(data)
        .catch(function (error) {
            console.log(error);
        }).then(function () {

    });
}

exports.updateFirebase = updateFirebase;
