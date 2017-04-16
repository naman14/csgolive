/**
 * Created by naman on 16/4/17.
 */

let $ = require('jQuery');

http = require('http');
fs = require('fs');

var port = 3000;
var host = '127.0.0.1';


var serverrunning = false;
var server;

$('#btn-start-server').click(function () {
    if (!serverrunning)
        startServer()
    else stopServer()

})

function stopServer() {
    server.close()
    $("#btn-start-server").html("Start server")

}

function startServer() {

    server = http.createServer(function(req, res) {

        console.log("waiting for post")
        if (req.method == 'POST') {

            console.log("post")

            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            var body = '';
            req.on('data', function(data) {
                body += data;
            });
            req.on('end', function() {
                //console.log("POST payload: " + body);
                update(JSON.parse(body));
                res.end('');
            });

        } else {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            var html = 'yes';
            res.end(html);
        }

    });

    server.on('error', function (e) {
        console.log(e);
        showToast("Unable to start server. Make sure no existing server is being run on "+host+":"+port);
        serverrunning = false;
        updateServerStatus()
    });

    server.listen(port, host);
    serverrunning = true

    updateServerStatus()
}


function update(json) {
    console.log(json)

}

function updateServerStatus() {
    if(serverrunning) {
        $("#btn-start-server").html("Stop server")

    } else {
        $("#btn-start-server").html("Start server")
    }
}

function showToast(message) {
    var snackbarContainer = document.querySelector('#status-toast');
    var data = {message: message, timeout: 5000};
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
}

