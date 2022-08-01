/**
 * Created by naman on 16/4/17.
 */

let $ = require('jQuery');
let gsi = require('./gsiparser.js')
let firebase = require('./firebaseupdate.js')
let { saveOnChain } = require('../onchain.js')

http = require('http');

let fs = require('fs');
let path = require('path');

const {dialog} = require('@electron/remote')
const {shell} = require('electron')

var content;

var port = 3000;
var host = '127.0.0.1';

var serverrunning = false;
var server;
var io;

$(document).ready(
    function(){
     pageLoaded()

    });

function stopServer() {
    server.close()
    serverrunning = false;
    updateServerStatus()

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

        dialog.showMessageBox(
            {title: "Choose csgo config location",type: "info",
            buttons:["OK"],
            message:"CSGO Live will create a config file that need to be present in the csgo cfg directory. Please choose the csgo cfg directory " +
            "It is generally located in - C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\csgo\cfg"}
            )
            .then(result => {
                console.log('herrrree')
                let filename = "/gamestate_integration_csgolive.cfg";
                try {
                    let path = dialog.showOpenDialogSync({properties: ['openDirectory']})[0] + filename;
                    console.log(path)
                    localStorage.setItem("cfgPath", path);
                    writeToFile(callback)
                } catch (err){

                }
            }
          );

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

    var shouldBroadcast = true;

    if(parsed.game.mode.toLowerCase() == "competitive") {
        shouldBroadcast = localStorage.getItem("broadcast_comp")
    } else if(parsed.game.mode.toLowerCase() == "casual") {
        shouldBroadcast = localStorage.getItem("broadcast_casual")
    } else if(parsed.game.mode.toLowerCase() == "deathmatch") {
        shouldBroadcast = localStorage.getItem("broadcast_dm")
    } else {
        shouldBroadcast = false;
    }

    if(shouldBroadcast) {
        firebase.updateFirebase(parsed)
    }

    //game over save data to firebase
    if(parsed.game.phase == "gameover") {
        if (localStorage.getItem("save_game_firebase")) {
            parsed.round = null;
            parsed.player.round_stats = null;
            parsed.player.player_weapons = null;
            let key = firebase.saveGameToFirebase(parsed)

            if (localStorage.getItem("save_onchain")) {
                saveOnChain(parsed, key)
            }
        }
    
    }


}

function updateServerStatus() {
    serverrunning = server != undefined && (server.address() != null)
    if(serverrunning) {
        $('#txt-server-status').html("Server is running. Access your live scores from the 'Live' menu of the app or from" +
            " the 'Watch' menu in the <a id='link-website' href=''>website<a/>")
        $("#btn-start-server").html("Stop server")
        
        $('#link-website').click(function (e) {
            e.preventDefault()
            shell.openExternal('https://csgolive-b4b34.firebaseapp.com/')
        })

    } else {
        $('#txt-server-status').html("Start the server and then play CS:CSGO, your live game will be " +
            "broadcasted and can be accessed from the 'Watch' side menu in the app or from the website")
        $("#btn-start-server").html("Start server")
    }
}

function showToast(message) {
    var snackbarContainer = document.querySelector('#status-toast');
    var data = {message: message, timeout: 5000};
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
}


function pageLoaded() {
    $('#btn-start-server').click(function () {
        updateServerStatus()
        if (!serverrunning)
            startServer()
        else stopServer()
    })

    $('#btn-logout').click(function () {
        localStorage.clear()
        location.href = './../index.html'
    })

    $('#btn-user-name').html(localStorage.getItem("username"));


    if(localStorage.getItem("broadcast_comp") == null) {
        localStorage.setItem("broadcast_comp", true);
    }
    if(localStorage.getItem("broadcast_casual") == null) {
        localStorage.setItem("broadcast_casual", true);
    }
    if(localStorage.getItem("broadcast_dm") == null) {
        localStorage.setItem("broadcast_dm", true);
    }
    if(localStorage.getItem("save_game_firebase") == null) {
        localStorage.setItem("save_game_firebase", true);
    }
    $('#checkbox-1').change(function () {
        if(this.checked) {
            localStorage.setItem("broadcast_comp", true);
        } else {
            localStorage.setItem("broadcast_comp", false)
        }
    })

    $('#checkbox-2').change(function () {
        if(this.checked) {
            localStorage.setItem("broadcast_casual", true);
        } else {
            localStorage.setItem("broadcast_casual", false)
        }
    })

    $('#checkbox-3').change(function () {
        if(this.checked) {
            localStorage.setItem("broadcast_dm", true);
        } else {
            localStorage.setItem("broadcast_dm", false)
        }
    })
    $('#switch-1').change(function () {
        if(this.checked) {
            localStorage.setItem("save_game_firebase", true);
        } else {
            localStorage.setItem("save_game_firebase", false)
        }
    })


    $('#checkbox-1').attr("checked",localStorage.getItem("broadcast_comp"));
    $('#checkbox-2').attr("checked",localStorage.getItem("broadcast_casual"));
    $('#checkbox-3').attr("checked",localStorage.getItem("broadcast_dm"));
    $('#switch-1').attr("checked",localStorage.getItem("save_game_firebase"));

}

exports.pageLoaded = pageLoaded;
exports.updateServerStatus = updateServerStatus;