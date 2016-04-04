
var database = require('./database');

var player = function(playerID, callback) {
  // Look in the DB for a player with that ID
  database.player( { _id: playerID }, function(docs) {
    callback(docs);
  });
};

var team = function(teamID, callback) {
  database.team( { _id: teamID }, function(docs) {
    callback(docs);
  });
};

module.exports = {
  player: player,
  team: team
};