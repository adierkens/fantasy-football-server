'use strict';
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://fantasyfootball:fantasyfootball@ds015740.mlab.com:15740/heroku_fgt30vfr';
var db;

const COLLECTIONS = {
  PLAYERS: 'players',
  TEAMS: 'teams',
  GAMES: 'games'
};

MongoClient.connect(url, function(err, database) {
  db = database;
});

var search = function(collection, filter, options, callback) {
  if (arguments.length === 3) {
    callback = options;
    options = {};
  }

  collection = db.collection(collection);
  collection.find(filter, options).toArray(function(err, docs) {
    if (err) {
      console.log(err);
      callback([]);
    } else {
      callback(docs);
    }
  });
};

var player = function(playerSearchObj, callback) {
  search(COLLECTIONS.PLAYERS, playerSearchObj, { limit: 1 }, function(docs) {
    if (docs.length === 0) {
      callback(null);
    } else {
      callback(docs[0]);
    }
  });
};

var players = function(playerSearchObj, callback) {
  search(COLLECTIONS.PLAYERS, playerSearchObj, callback);
};

var team = function(teamSearchObj, callback) {
  search(COLLECTIONS.TEAMS, teamSearchObj, { limit: 1 }, function(docs) {
    if (docs.length === 0) {
      callback(null);
    } else {
      callback(docs[0]);
    }
  });
};

function addToCollection(collection, obj) {
  collection = db.collection(collection);
  collection.insertOne(obj);
}

var addPlayer = function(playerObj) {
  addToCollection(COLLECTIONS.PLAYERS, playerObj);
};

var addTeam = function(teamObj) {
  addToCollection(COLLECTIONS.TEAMS, teamObj);
};

var addGame = function(game) {
  addToCollection(COLLECTIONS.GAMES, game)
};

var dropAll = function() {
  db.dropDatabase();
};

module.exports = {
  player: player,
  players: players,
  team: team,
  addPlayer: addPlayer,
  addTeam: addTeam,
  addGame: addGame,
  dropAll: dropAll
};

process.on('SIGTERM', function() {
  if (db) {
    db.close();
  }
});