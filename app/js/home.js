/**
 * Created by naman on 16/4/17.
 */

let $ = require('jQuery');

$(document).ready(function (){
    $('#content').load('./cfgsetup.html');

    $('#nav-cfgsetup').click(function(){
        $('#content').load('./cfgsetup.html', function () {
            require('./../js/gsi/server.js').pageLoaded()
        });
    });

    $('#nav-pastmatches').click(function(){
        $('#content').load('./pastmatches.html');
    });

    $('#nav-stats').click(function(){
        $('#content').load('./stats.html');
    });

    $('#nav-live').click(function(){
        $('#content').load('./livegame.html', function () {
            require('./../js/livegame.js').pageLoaded()

        });
    });

    $('#nav-watch').click(function(){
        $('#content').load('./watchgame.html', function () {
            require('./../js/watchgame.js').pageLoaded()
        });
    });

});
