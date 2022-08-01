/**
 * Created by naman on 17/4/17.
 */

let $ = require('jQuery');

let firebaseapp = require('./../../modules/firebaseconfig.js').firebaseapp

function updateFirebase(data) {

    let username = localStorage.getItem('username');

    if(username == null) {
        console.log("username undefined, aborting..")
        return;
    }

    let database = firebaseapp.database();

    database.ref('/users/' + username).child("live").set(data)
        .catch(function (error) {
            console.log(error);
        }).then(function () {

    });
}

function saveGameToFirebase(data) {
    let username = localStorage.getItem('username');

    if(username == null) {
        console.log("username undefined, aborting..")
        return;
    }

    let database = firebaseapp.database();

    let ref = database.ref('/users/' + username).child("games").push()
    ref.set(data)
        .catch(function (error) {
            console.log(error);
        }).then(function () {
    });
    return ref.key
}

function uploadScoreToStorage(blob, key, uploadCallback) {
    let username = localStorage.getItem('username');

    if(username == null) {
        console.log("username undefined, aborting..")
        return;
    }

    let storage = firebaseapp.storage()
    let storageRef = storage.ref(`nfts/${username}/${key}`)
    console.log(blob)
    storageRef.put(blob).then(() => {
        storageRef.getDownloadURL().then((url) => {
            uploadCallback(url)
        })
    })
}

function setOnchainInfoGame(onchainInfo, key) {
    let username = localStorage.getItem('username');

    if(username == null) {
        console.log("username undefined, aborting..")
        return;
    }

    let database = firebaseapp.database();

    database.ref('/users/' + username).child("games").child(key).child('nft').set(onchainInfo)

}

exports.updateFirebase = updateFirebase;
exports.saveGameToFirebase = saveGameToFirebase;
exports.uploadScoreToStorage = uploadScoreToStorage
exports.setOnchainInfoGame = setOnchainInfoGame