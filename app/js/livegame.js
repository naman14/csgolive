/**
 * Created by naman on 16/4/17.
 */

var socket = io('http://127.0.0.1:3000');

let renderer = require('./../modules/liverenderer.js')

socket.on('connect', function(){
    renderer.updateLiveStatus(1)
});

socket.on('connect_error', function(){
       renderer.updateLiveStatus(0)
});

socket.on('update', function (data) {
  renderer.renderData(data)
});

socket.on('disconnect', function(){

});



