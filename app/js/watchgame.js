/**
 * Created by naman on 17/4/17.
 */

let $ = require('jQuery');

let renderer = require('./../modules/liverenderer.js')
let firebaseapp = require('./../modules/firebaseconfig').firebaseapp;


$('#btn-watch-user').click(function () {

    let username = $('#input-username').val();

   let userref =  firebaseapp.database().ref('/users/'+ username);

    userref.on('value', function(snapshot) {

        if (snapshot.exists()) {

            if(snapshot.hasChild('live')) {

                userref.child('live').on('value', function (snapshot) {

                    $('#user-select').hide();
                    $('#parent').show();

                    renderer.updateLiveStatus(1);
                    renderer.renderData(snapshot)
                })

            } else {
                showToast("User is not live");
                renderer.updateLiveStatus(0);
            }

        }
        else {
           showToast("User does not exist")
        }
    });
   



});


function showToast(message) {
    var snackbarContainer = document.querySelector('#status-toast');
    var data = {message: message, timeout: 5000};
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
}