/**
 * Created by naman on 16/4/17.
 */


let $ = require('jQuery')
let renderer = require('./../modules/liverenderer.js')

function pageLoaded() {
    renderer.updateLiveStatus(0);

    let socket = io('http://127.0.0.1:3000');

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
        renderer.updateLiveStatus(0)
    });

}

exports.pageLoaded = pageLoaded;



