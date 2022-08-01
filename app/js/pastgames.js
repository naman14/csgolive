/**
 * Created by naman on 18/4/17.
 */
let firebaseapp = require('./../modules/firebaseconfig').firebaseapp;
let $ = require('jQuery')

var array = [];

function fetchPastGames() {
    firebaseapp.database().ref("/users/"+localStorage.getItem("username")).child("games")
        .orderByChild("timestamp").once('value').then(function (snapshot) {

        if (snapshot.exists) {
            $('#loading').hide()
            snapshot.forEach(function (child) {

            var key = child.key;
            var game = child.val();
            array.push({game: game, key: key});


        });

            if(array.length != 0) {
                array.reverse();

                let arrayLength = array.length;
                for (var i = 0; i < arrayLength; i++) {
                    let game = array[i].game;
                    let key = array[i].key;

                    renderGame(game, key)
                }
            } else {
                $('#loading').hide()
                showToast("No past games found")
            }

    } else {
            $('#loading').hide()
            showToast("No past games found")
        }
    }).catch(function (error) {
        $('#loading').hide()
        showToast("No past games found")

    })
}

function renderGame(game, key) {

    let listitem = '<div id='+'"'+key+'"'+'style="margin: auto;"></div> '

    $('#games-list').append(listitem);

    $('#'+key+'').load('./../html/pastgameitem.html', function () {

        updateGameInfo(game,key);
        updateScore(game.player,key);


    });
}

function updateGameInfo(game, key) {
    if(game.game.t_score == game.game.ct_score) {
        $('#'+key+'').find('#btn-win-team').html("Game draw");

    } else {
        if (game.game.t_score > game.game.ct_score && game.player.team == "T") {
            $('#'+key+'').find('#btn-win-team').html("You won this game");
        }
        if (game.game.t_score < game.game.ct_score && game.player.team == "T") {
            $('#'+key+'').find('#btn-win-team').html("You lost this game");
        }
        if (game.game.t_score > game.game.ct_score && game.player.team == "CT") {
            $('#'+key+'').find('#btn-win-team').html("You lost this game");
        }

        if (game.game.t_score < game.game.ct_score && game.player.team == "CT") {
            $('#'+key+'').find('#btn-win-team').html("You won this game");
        }
    }
    $('#'+key+'').find('#btn-game-map').html(game.game.mode + " " + game.game.map);
    
    if (game.nft) {
        $('#'+key+'').find('#container-nft').show()
        $('#'+key+'').find('#btn-nft').click(function(){
            require("electron").shell.openExternal(`https://testnets.opensea.io/assets/mumbai/${game.nft.contractAddress}/${game.nft.tokenId}`)
        }); 
    } else {
        $('#'+key+'').find('#container-nft').hide()
    }

    $('#'+key+'').find('#score-ct').html(game.game.ct_score);
    $('#'+key+'').find('#score-t').html(game.game.t_score);

    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    let date = new Date(game.timestamp * 1000);

    $('#'+key+'').find('#btn-game-date').html("Played on "+date.getDate() + " "+ months[date.getMonth()]+" "+ date.getFullYear());


}

function updateScore(player, key) {

    $('#'+key+'').find('#'+player.steam_id+'').remove();
    prependPlayerScore(player, key)
}

function prependPlayerScore(player, key) {
    $('#'+key+'').find('#score-table-body').prepend('<tr id='+player.steam_id+'> ' +
        '<td class="mdl-data-table__cell--non-numeric">'+player.name+'</td> ' +
        '<td>'+player.match_stats.kills+'</td> ' +
        '<td>'+player.match_stats.assists+'</td> ' +
        '<td>'+player.match_stats.deaths+'</td> ' +
        '<td>'+player.match_stats.mvps+'</td> ' +
        '<td>'+player.match_stats.score+'</td> ' +
        '</tr>')
}

function showToast(message) {
    var snackbarContainer = document.querySelector('#status-toast');
    var data = {message: message, timeout: 5000};
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
}


function pageLoaded() {
    $('#loading').show();
    fetchPastGames()
}

exports.pageLoaded = pageLoaded;
exports.renderGame = renderGame