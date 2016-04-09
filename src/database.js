'use strict';
var MongoClient = require('mongodb').MongoClient;
var username = process.env.FF_MONGO_USERNAME;
var password = process.env.FF_MONGO_PASSWORD;
var url = 'mongodb://' + username + ':' + password + '@ds015740.mlab.com:15740/heroku_fgt30vfr';
var db;

const COLLECTIONS = {
  PLAYERS: 'players',
  TEAMS: 'teams',
  GAMES: 'games',
  USER_SAVED_GRAPHS: 'userSavedGraphs'
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

var games = function(gameSearchObj, callback) {
    search(COLLECTIONS.GAMES, gameSearchObj, callback);
};

var userSavedGames = function(userSavedGamesObj, callback) {
  search(COLLECTIONS.USER_SAVED_GRAPHS, userSavedGamesObj, callback);
};

function addToCollection(collection, obj) {
  collection = db.collection(collection);
  collection.updateOne({_id: obj._id}, obj, { upsert: true });
}

function removeFromCollection(collection, obj) {
  console.log(obj);
  collection = db.collection(collection);
  collection.deleteOne(obj);
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

var addUserSave = function(userSave) {
  addToCollection(COLLECTIONS.USER_SAVED_GRAPHS, userSave);
};

var delUserSave = function(userSaveID) {
  removeFromCollection(COLLECTIONS.USER_SAVED_GRAPHS, userSaveID);
};

var dropAll = function() {
  db.dropDatabase();
};

module.exports = {
  player: player,
  players: players,
  team: team,
  games: games,
  addPlayer: addPlayer,
  addTeam: addTeam,
  addGame: addGame,
  dropAll: dropAll,
  userSavedGames: userSavedGames,
  addUserSave: addUserSave,
  delUserSave: delUserSave
};

process.on('SIGTERM', function() {
  if (db) {
    db.close();
  }
});