/**
 * Created by naman on 16/4/17.
 */

var socket = io('http://127.0.0.1:3000');
let $ = require('jQuery')

socket.on('update', function (data) {
    console.log("update nin libe game")
    $('#payload').html(data)
})
