/**
 * Created by naman on 16/4/17.
 */

let $ = require('jQuery');

let fs = require('fs');
let path = require('path');

const {dialog} = require('electron').remote;

var content;

$('#btn-cfg').click(function () {
    readLocalCfgFile()

})

function createCfg() {

    let filename = "/csgolive.cfg";

    let path = dialog.showOpenDialog({properties: ['openDirectory']})[0] + filename;
    console.log(path)

    try { fs.writeFileSync(path, content, 'utf8'); }

    catch(e) { alert('Failed to save the file !'); }

}



function readLocalCfgFile() {
    fs.readFile(path.resolve(__dirname, 'csgolive.cfg'), function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;

        processFile();
    });
}


function processFile() {
    createCfg()
}
