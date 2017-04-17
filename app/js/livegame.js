/**
 * Created by naman on 16/4/17.
 */

var socket = io('http://127.0.0.1:3000');
let $ = require('jQuery')

let icons = require('./gsi/gsiparser.js').icons


//0 - server not running, not live
//1- server running - waiting for data - not live
//2 - server running - receiving data - live


var playerName = "";
var playerID;

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

    playerID = json.steam_id;
    updateLiveStatus(2)


    if(json.player.team == "T") {
        $('#btn-player-team').html("Terrorist");
    } else if(json.player.team == "CT") {
        $('#btn-player-team').html("Counter Terrorist");
    }


    updateGameInfo(json.game);
    updateScore(json.player);

    updateRoundInfo( json.game.round+1 , json.round, json.player, json.steam_id)
    updateWeapons(json.player.player_weapons)


    $('#btn-player-name').html(playerName);

});

socket.on('disconnect', function(){

});


function updateGameInfo(game) {
    $('#btn-game-map').html(game.mode + " " + game.map);
    $('#score-ct').html(game.ct_score);
    $('#score-t').html(game.t_score);


}

function updateRoundInfo( currentRound, round, player, playerId) {

    $('#round-stats-list').empty();

    if(round.phase != "over") {
        $('#round-details').html('Round ' + currentRound + " - " + round.phase);
    }

    if(player.steam_id == playerId) {
        playerName = player.name;
        let playerRoundStats = player.name + " : " + player.round_stats.kills + " kills, " + player.round_stats.hs_kills + " headshots";
        $('#round-stats-list').append('<li class="mdl-list__item"> ' +
            '<span class="mdl-list__item-primary-content">'+ playerRoundStats +'</span>');
    } else {
        let playerRoundStats = playerName + " : dead";
        $('#round-stats-list').append('<li class="mdl-list__item"> ' +
            '<span class="mdl-list__item-primary-content">'+ playerRoundStats +'</span>');
    }

    if(round.bomb_status != "") {
        $('#round-stats-list').append('<li class="mdl-list__item"> ' +
            '<span class="mdl-list__item-primary-content">'+'Bomb '+round.bomb_status+'</span>' +
            ' <img class="material-icons mdl-list__item-icon" src='+icons["c4"]+'></img>');
    };

    if(round.win_team != "") {
        var winText = "";
        if(round.win_team = "T") {
            winText = "Terrorists win"
        } else if(round.win_team = "CT") {
            winText = "Counter terrorists win"
        }
        $('#round-details').html('Round ' + currentRound + " - " + winText);
        $('#round-stats-list').append('<li class="mdl-list__item"> ' +
            '<span class="mdl-list__item-primary-content">'+winText+'</span>');
    }
}

function updateWeapons(weapons) {

    $('#div-weapons').empty();

    let size = weapons.length;

    for (let i = 0; i < size; i++) {
        let weapon = weapons[i];
        let  weaponIcon = icons[weapon.name];


        // $('#div-weapons').append('<div>  ' +
        //     '   <div class="weaponText"><p>'+weapon.name+'</p> </div>' +
        //     '<img class="weaponImg" src='+weaponIcon+' /> </div>')

        $('#div-weapons').append(
            '<img class="weaponImg" src='+weaponIcon+' />')
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
        // $('#live-container').hide()

    } else if( i== 1) {
        $('#live-status').html("Waiting for data...");
        $('#live-status').show()
        $('#live-container').hide()

    } else {
        $('#live-status').hide()
        $('#live-container').show()
    }
}

