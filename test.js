/**
 * Created by naman on 24/02/17.
 */

var express = require('express')
var app = express()

app.get('/', function (req, res) {
    res.send('Hello!')
})

app.listen(3000, function () {
    console.log('Port 3000')
})
