'use strict';
var express = require('express');
var fetch = require('./src/fetch');
var bodyparser = require('body-parser');
var stats = require('./src/stats');

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

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Content-Type', 'application/json');

  console.log('Getting players');
  fetch.players(function(players) {
    res.send(players);
  });
});

app.post('/stat', function(req, res) {

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Content-Type', 'application/json');

  if (Object.keys(req.body).length < 1) {
    res.send({
      status: 'error',
      data: 'Must specify one or more fields to filter on'
    });
    return;
  }

  stats(req.body, function(response) {
    res.send({
      status: 'success',
      data: response
    });
  });

});

app.post('/player', function(req, res) {

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Content-Type', 'application/json');

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


app.post('/userSave', function(req, res) {

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Content-Type', 'application/json');

  if (req.body) {
    if (req.body.operation === 'DELETE') {
      var savedGraphID = req.body.savedGraphID;
      fetch.delUserSave(savedGraphID);
      res.send({
        status: 'success'
      });
    } else if (req.body.operation === 'ADD') {
      var savedGraph = req.body.savedGraph;
      fetch.addUserSave(savedGraph);
      res.send({
        status: 'success'
      });
    } else {
      // GET operation
      fetch.userSavedGames(req.body.userID, function(savedGraphs) {
        res.send({
          status: 'success',
          data: savedGraphs
        });
      });
    }
  }
});

app.listen(port, function() {
  console.log('Server listening on port ' + port);
});

