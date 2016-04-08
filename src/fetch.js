
var database = require('./database');

var player = function(playerID, callback) {
  // Look in the DB for a player with that ID

  var search = playerID;

  if (typeof search === 'string') {
    search = {
      _id: playerID
    }
  }

  database.players(search, function(docs) {
    callback(docs);
  });
};

var team = function(teamID, callback) {
  database.teams( { _id: teamID }, function(docs) {
    callback(docs);
  });
};

var game = function(gameID, callback) {
  console.log(gameID);
  var search = gameID;

  if (typeof search === 'string') {
    search = {
      _id: gameID
    };

    database.games(search, function (docs) {
      callback(docs);
    })
  }

};

var userSavedGames = function(userID, callback) {
  database.userSavedGames({
    userID: userID
  }, callback);
};

var addUserSave = function(saveObj) {
  database.addUserSave(saveObj);
};

var delUserSave = function(saveID) {
  var saveObj = {
    _id: saveID
  };
  database.delUserSave(saveObj);
};

module.exports = {
  player: player,
  team: team,
  game: game,
  userSavedGames: userSavedGames,
  addUserSave: addUserSave,
  delUserSave: delUserSave
};