/**
 * Created by naman on 16/4/17.
 */

let $ = require('jQuery');
let gsi = require('./gsiparser.js')
let firebase = require('./firebaseupdate.js')

http = require('http');

let fs = require('fs');
let path = require('path');

const {dialog} = require('electron').remote;

var content;

var port = 3000;
var host = '127.0.0.1';

var serverrunning = false;
var server;
var io;

$('#btn-start-server').click(function () {
    updateServerStatus()
    if (!serverrunning)
        startServer()
    else stopServer()
})


function stopServer() {
    server.close()
    serverrunning = false;
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



    readLocalCfgFile( function () {
        server.listen(port, host, function () {
            serverrunning = true;
            updateServerStatus()

            if(server.address() != null) {
                io = require('socket.io')(server);

                io.on('connection', function(client){
                    console.log("connected to socket")
                });

            }
        });
    });



}


function createCfg(callback) {

    if (localStorage.getItem("cfgPath") == null) {

        dialog.showMessageBox({title: "Choose csgo config location",type: "info",
                buttons:["OK"],
                message:"You will need to choose the csgo cfg directory where the config file need to be present. " +
                "It is generally located in - <br>C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\csgo\cfg"},
            function () {
                let filename = "/csgolive.cfg";
                let path = dialog.showOpenDialog({properties: ['openDirectory']})[0] + filename;
                console.log(path)
                localStorage.setItem("cfgPath", path);
                writeToFile(callback)
            })
    } else {
        writeToFile(callback)
    }

}

function writeToFile(callback) {
    try {
        fs.writeFileSync(localStorage.getItem("cfgPath"), content, 'utf8');
        callback()
    }

    catch (e) {
        alert('Failed to save the file !');
    }
}



function readLocalCfgFile(callback) {
    fs.readFile(path.resolve(__dirname, 'csgolive.cfg'), 'utf8', function read(err, data) {
        if (err) {
            throw err;
        }

        content = data;

       createCfg(callback)
    });
}


function update(json) {
    let parsed = gsi.parseData(JSON.stringify(json));
    console.log("full model"+ JSON.stringify(parsed));
    io.emit('update', JSON.stringify(parsed))
    firebase.updateFirebase(parsed)


}

function updateServerStatus() {
    serverrunning = server != undefined && (server.address() != null)
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

exports.updateServerStatus = updateServerStatus;