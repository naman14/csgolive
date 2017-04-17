/**
 * Created by naman on 16/4/17.
 */

var socket = io('http://127.0.0.1:3000');
let $ = require('jQuery')

let icons = require('./gsi/gsiparser.js').icons


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

    updateScore(json.player);
    updateWeapons(json.player.player_weapons)

});

socket.on('disconnect', function(){

});

function updateWeapons(weapons) {

    $('#div-weapons').empty();

    let size = weapons.length;

    for (let i = 0; i < size; i++) {
        let weapon = weapons[i];
        let  weaponIcon = icons[weapon.name];
        $('#div-weapons').append('<img class="weaponImg" src='+weaponIcon+' />')
    }

}


function updateScore(player) {

    $('#score-table-body').empty();

    $('#score-table-body').append('<tr> ' +
        '<td class="mdl-data-table__cell--non-numeric">'+player.name+'</td> ' +
        '<td>'+player.match_stats.kills+'</td> ' +
        '<td>'+player.match_stats.assists+'</td> ' +
        '<td>'+player.match_stats.deaths+'</td> ' +
        '<td>'+player.match_stats.mvps+'</td> ' +
        '<td>'+player.match_stats.score+'</td> ' +
        '</tr>')
}
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

