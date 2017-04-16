/**
 * Created by naman on 16/4/17.
 */

let $ = require('jQuery');

$(document).ready(function (){
    $('#content').load('./cfgsetup.html');

    $('#cfgsetup').click(function(){
        $('#content').load('./cfgsetup.html');
    });

    $('#serversetup').click(function(){
        $('#content').load('./serversetup.html');
    });

});
