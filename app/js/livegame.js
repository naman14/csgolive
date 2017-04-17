/**
 * Created by naman on 16/4/17.
 */

var socket = io('http://127.0.0.1:3000');
let $ = require('jQuery')


//0 - server not running, not live
//1- server running - waiting for data - not live
//2 - server running - receiving data - live


socket.on('connect', function(){
    updateLiveStatus(1)
});

socket.on('connect_error', function(){
        updateLiveStatus(0)
});

socket.on('update', function (data) {
    let json = JSON.parse(data);

    if(json.game.mode == "") {
        updateLiveStatus(1);
        return;
    }

    updateLiveStatus(2)

});

socket.on('disconnect', function(){

});

function updateLiveStatus(i) {
    if(i ==0) {


        $('#live-status').html("You are not live :(");
        $('#live-status').show()
        $('#live-container').hide()

    } else if( i== 1) {
        $('#live-status').html("Waiting for data...");
        $('#live-status').show()
        $('#live-container').hide()

    } else {
        $('#live-status').hide()
        $('#live-container').show()
    }
}

