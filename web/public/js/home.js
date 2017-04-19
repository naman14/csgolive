/**
 * Created by naman on 16/4/17.
 */

var $;

jQuery(document).ready(function($){
    this.$ = $;
    $('#content').load('./../html/about.html', function () {
        pageLoaded($)
        reloadComponentHandler()
    });


    $('#nav-watch').click(function(){
        $('#content').load('./../html/watchgame.html', function () {
            pageLoaded($)
            reloadComponentHandler()

        });
    });
    $('#nav-download').click(function(){
        $('#content').load('./../html/download.html', function () {

        });
    });

    $('#nav-about').click(function(){
        $('#content').load('./../html/about.html', function () {

        });
    });



});


function reloadComponentHandler() {
    if(!(typeof(componentHandler) == 'undefined')){
        componentHandler.upgradeAllRegistered();
    }
}