/**
 * Created by naman on 17/4/17.
 */

let $ = require('jQuery')

let icons = require('./../js/gsi/gsiparser.js').icons;

var playerName = '< waiting for name >';
var playerID;

//0 - server not running, not live
//1- server running - waiting for data - not live
//2 - server running - receiving data - live

var redcss = 'style= "color:red"';
var bluecss = 'style= "color:blue"';
var blackcss = 'style= "color:black"';

function renderData(data) {
    let json = JSON.parse(data);

    console.log("no update for " + (new Date().getTime() / 1000 - json.timestamp) + " seconds");
    if((new Date().getTime() / 1000 - json.timestamp) > 60) {
        updateLiveStatus(0);
        let lastLiveTime;
        let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        let date = new Date(json.timestamp * 1000);

        lastLiveTime = "Last live on "+ date.getDate()+ " "+ months[date.getMonth()]+ " " + date.getFullYear();
        $('#live-status-message').html("User is not currently live<br>"+lastLiveTime);
        return;
    }

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

    if(json.player.player_weapons) {
        updateWeapons(json.player.player_weapons)
    }


    $('#btn-player-name').html(playerName);
}
function updateGameInfo(game) {
    $('#btn-game-map').html(game.mode + " " + game.map);
    $('#btn-live-status').html(game.phase);
    $('#score-ct').html(game.ct_score);
    $('#score-t').html(game.t_score);


}


function updateRoundInfo( currentRound, round, player, playerId) {

    $('#round-stats-list').empty();


    $('#round-stats-list').append('<li class="mdl-list__item"> ' +
            '<span class="mdl-list__item-primary-content txtCardTitle">' + 'Round ' + currentRound + " - " + round.phase + '</span>');

    if(player.steam_id == playerId) {
        playerName = player.name;
        let playerRoundStats = player.name + " : " + player.round_stats.kills + " kills, " + player.round_stats.hs_kills + " headshots";
        $('#round-stats-list').append('<li class="mdl-list__item"> ' +
            '<span class="mdl-list__item-primary-content">'+ playerRoundStats +'</span>');

        if(round.phase != "over") {
            var armorStatus = ", ";

            if (player.round_stats.armor != 0) {
                armorStatus += player.round_stats.armor + ' % armor';
            } else {
                armorStatus += "no armor";
            }
            armorStatus += ', $' + player.round_stats.money;

            $('#round-stats-list').append('<li class="mdl-list__item"> ' +
                '<span class="mdl-list__item-primary-content">' + player.round_stats.health + ' HP' + armorStatus + '</span></li>');

        }


    } else {
        let playerRoundStats = playerName + ": dead";
        let spectating =  "spectating: "+ player.name;
        $('#round-stats-list').append('<li class="mdl-list__item"> ' +
            '<span class="mdl-list__item-primary-content">'+ playerRoundStats+", "+spectating +'</span>');
    }

    if(round.bomb_status != "") {
        var css;

        if(round.bomb_status == "defused") {
            css = bluecss;
        } else {
            css = redcss;
        }

        $('#round-stats-list').append('<li class="mdl-list__item"> ' +
            '<span class="mdl-list__item-primary-content"'+css+'>'+'Bomb '+round.bomb_status +
            ' <img class="material-icons mdl-list__item-icon" style="margin-left: 13px;" src='+icons["c4"]+'></img></span></li>');
    };

    if(round.win_team != "") {
        var winText = "";
        var css =blackcss
        if(round.win_team = "T") {
            winText = "Terrorists win"
            css =  redcss;
        } else if(round.win_team = "CT") {
            winText = "Counter terrorists win"
            css =  bluecss;
        }
        $('#round-stats-list').append('<li class="mdl-list__item"> ' +
            '<span class="mdl-list__item-primary-content"'+css+'>'+winText+'</span>');
    }
}

function updateWeapons(weapons) {

    $('#div-weapons').empty();

    let size = weapons.length;

    for (let i = 0; i < size; i++) {
        let weapon = weapons[i];
        let  weaponIcon = icons[weapon.name];

        $('#div-weapons').append(
            '<img class="weaponImg" src='+weaponIcon+' />')
    }

}


function updateScore(player) {


    if(player.steam_id == playerID) {
        $('#'+player.steam_id+'').remove();
        prependPlayerScore(player)
    } else {
        $('#'+player.steam_id+'').remove();
        appendPlayerScore(player);

    }
}

function appendPlayerScore(player) {
    $('#score-table-body').append('<tr id='+player.steam_id+'> ' +
        '<td class="mdl-data-table__cell--non-numeric">'+player.name+'</td> ' +
        '<td>'+player.match_stats.kills+'</td> ' +
        '<td>'+player.match_stats.assists+'</td> ' +
        '<td>'+player.match_stats.deaths+'</td> ' +
        '<td>'+player.match_stats.mvps+'</td> ' +
        '<td>'+player.match_stats.score+'</td> ' +
        '</tr>')
}

function prependPlayerScore(player) {
    $('#score-table-body').prepend('<tr id='+player.steam_id+'> ' +
        '<td class="mdl-data-table__cell--non-numeric">'+player.name+'</td> ' +
        '<td>'+player.match_stats.kills+'</td> ' +
        '<td>'+player.match_stats.assists+'</td> ' +
        '<td>'+player.match_stats.deaths+'</td> ' +
        '<td>'+player.match_stats.mvps+'</td> ' +
        '<td>'+player.match_stats.score+'</td> ' +
        '</tr>')
}
function updateLiveStatus(i, live) {
    if(i ==0) {

        $('#live-status').show()
        $('#live-status-message').show()
        $('#live-container').hide()

        if(live) {
            $('#live-status').html("You are not live :(");
            $('#live-status-message').html("Start the server and then play CS:GO");

        } else {
            $('#live-status').html("User not live :(");
            $('#live-status-message').html("User is not currently live");

        }


    } else if( i== 1) {
        $('#live-status').show()
        $('#live-status-message').show()
        $('#live-container').hide()

        if(live) {
            $('#live-status').html("Waiting for data...");
            $('#live-status-message').html("Start playing and live score will appear here");
        } else {
            $('#live-status').html("Connecting...");
            $('#live-status-message').html("Live data will soon appear here");
        }


    } else if( i == 2){
        $('#live-status').hide()
        $('#live-container').show()
        $('#live-status-message').hide()

    }
}

exports.renderData = renderData;
exports.updateLiveStatus = updateLiveStatus;

