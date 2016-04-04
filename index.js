'use strict';
var express = require('express');
var fetch = require('./src/fetch');

var app = express();
var port = process.env.PORT || 8888;
var router = express.Router();

router.get('/players', function(req, res) {
  console.log('Getting players');
  fetch.players(function(players) {
    res.send(players);
  });
});

router.get('/player/:playerID', function(req, res) {
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

router.get('/teams', function(req, res) {
  fetch.teams(function(teams) {
    res.send(teams);
  })
});

router.get('/team/:teamID', function(req, res) {
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

app.use('/', router);
app.listen(port, function() {
  console.log('Server listening on port ' + port);
});

