/**
 * Created by naman on 17/4/17.
 */

let $ = require('jQuery');

let renderer = require('./../modules/liverenderer.js')
let firebaseapp = require('./../modules/firebaseconfig').firebaseapp;

function checkFirebaseData(username) {
    let userref =  firebaseapp.database().ref('/users/'+ username);

    userref.on('value', function(snapshot) {

        if (snapshot.exists()) {

            if(snapshot.hasChild('live')) {

                userref.child('live').on('value', function (snapshot) {

                    $('#user-select').hide();
                    $('#parent').show();
                    $('#loading').hide()

                    renderer.updateLiveStatus(1);

                    renderer.renderData(JSON.stringify(snapshot.val()))
                })

            } else {
                $('#loading').hide()
                showToast("User is not live");
                renderer.updateLiveStatus(0);
            }

        }
        else {
            $('#loading').hide()
            showToast("User does not exist")
        }
    });
}



function showToast(message) {
    var snackbarContainer = document.querySelector('#status-toast');
    var data = {message: message, timeout: 5000};
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
}

function pageLoaded() {

    $('#user-select').show()
    $('#parent').hide()
    $('#loading').hide()

    renderer.updateLiveStatus(0)

    $('#btn-watch-user').click(function () {
        let username = $('#input-username').val();
        $('#loading').show()
        checkFirebaseData(username)
    });

}

exports.pageLoaded = pageLoaded;