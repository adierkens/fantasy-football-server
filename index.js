'use strict';
var express = require('express');
var fetch = require('./src/fetch');
var bodyparser = require('body-parser');

var app = express();
var port = process.env.PORT || 8888;
app.use(bodyparser.json());

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Content-Type', 'application/json');
  next();
};
app.use(allowCrossDomain);

app.get('/players', function(req, res) {
  console.log('Getting players');
  fetch.players(function(players) {
    res.send(players);
  });
});

app.post('/player', function(req, res) {

  if (Object.keys(req.body).length < 1) {
    res.send({
      status: 'error',
      data: 'Must specify one or more fields to filter on'
    });
    return;
  }

  fetch.player(req.body, function(players) {
    if (players) {
      res.send({
        status: 'success',
        data: players
      });
    } else {
      res.send({
        status: 'error',
        data: 'No players found'
      });
    }
  });
});

app.get('/player/:playerID', function(req, res) {
  fetch.player(req.params.playerID, function(player) {
    if (player) {
      res.send({
        status: 'success',
        data: player
      });
    } else {
      res.send({
        status: 'error',
        message: 'No player with that ID found'
      });
    }
  });
});

app.get('/teams', function(req, res) {
  fetch.teams(function(teams) {
    res.send(teams);
  })
});

app.get('/team/:teamID', function(req, res) {
  fetch.team(req.params.teamID, function(team) {
    if (team) {
      res.send({
        status: 'success',
        data: team
      });
    } else {
      res.send({
        status: 'error',
        data: 'No team with that ID found'
      });
    }
  });
});

app.listen(port, function() {
  console.log('Server listening on port ' + port);
});

