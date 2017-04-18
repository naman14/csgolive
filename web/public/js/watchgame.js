/**
 * Created by naman on 17/4/17.
 */

var $;

function checkFirebaseData(username) {
    let userref =  firebaseapp.database().ref('/users/'+ username);

    userref.on('value', function(snapshot) {

        if (snapshot.exists()) {

            if(snapshot.hasChild('live')) {

                userref.child('live').on('value', function (snapshot) {

                    $('#user-select').hide();
                    $('#parent').show();
                    $('#loading').hide()

                    updateLiveStatus(1, false);

                    renderData(JSON.stringify(snapshot.val()))
                })

            } else {
                $('#loading').hide()
                showToast("User is not live");
                updateLiveStatus(0, false);
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

jQuery(document).ready(function($){
    this.$ = $;
    pageLoaded($)

});

function pageLoaded($) {

    this.$ = $;
    this.$('#user-select').show()
    this.$('#parent').hide()
    this.$('#loading').hide()

    updateLiveStatus(0, false)

    this.$('#btn-watch-user').click(function () {
        let username = $('#input-username').val();
        $('#loading').show()
        checkFirebaseData(username)
    });

}
