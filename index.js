/**
 * Created by naman on 24/02/17.
 */
var admin = require("firebase-admin");

var serviceAccount = require("csgolive_serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://csgolive-b4b34.firebaseio.com/"
});