/**
 * Created by naman on 16/4/17.
 */

var $;

jQuery(document).ready(function($){
    this.$ = $;
    $('#content').load('./../html/watchgame.html', function () {
        pageLoaded($)
        reloadComponentHandler()
    });


    $('#nav-watch').click(function(){
        $('#content').load('./../html/watchgame.html', function () {
            pageLoaded($)
            reloadComponentHandler()

        });
    });


});


function reloadComponentHandler() {
    if(!(typeof(componentHandler) == 'undefined')){
        componentHandler.upgradeAllRegistered();
    }
}