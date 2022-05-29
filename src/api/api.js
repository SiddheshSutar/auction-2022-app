const express = require('express')
const app = express()
var http = require('http');

const teams = require("../apiLists/ListOfTeams.js");
const players = require("../apiLists/ListOfPlayers");

app.get('/', function (req, res) {
    res.send("default")
})
app.get('/teams', function (req, res) {
    res.send(teams)
})
app.get('/players', function (req, res) {
    res.send(players)
})

http.createServer(app).listen(3000);