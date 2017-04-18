/**
 * Created by naman on 16/4/17.
 */

let $ = require('jQuery')
let renderer = require('./../modules/liverenderer.js')

function pageLoaded() {
    renderer.updateLiveStatus(0, true);

    let socket = io('http://127.0.0.1:3000');

    socket.on('connect', function(){
        renderer.updateLiveStatus(1, true)
    });

    socket.on('connect_error', function(){
        renderer.updateLiveStatus(0, true)
    });

    socket.on('update', function (data) {
        renderer.renderData(data, true)
    });

    socket.on('disconnect', function(){
        renderer.updateLiveStatus(0, true)
    });

}

exports.pageLoaded = pageLoaded;



