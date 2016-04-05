/**
 * Created by Adam on 3/14/16.
 */
var NFLStats = require('nfl-game-stats');
var database = require('./database');
var attributes = require('./attributes');
var _ = require('lodash');

const NUMBER_OF_WEEKS = 10;

function addTeamToDatabase(team) {
  var teamID = team.alias.toUpperCase();
  team = _.pick(team, attributes.team);
  team._id = teamID;
  console.log('Adding team ' + teamID);
  database.addTeam(team);
}

function addPlayerToDatabase(player, team) {
  var playerID = (team.alias + player.player__number).toUpperCase();
  player = _.pick(player, Object.keys(attributes.player));

  var playerDBObj = {};

  _.forEach(player, function(val, key) {
    playerDBObj[attributes.player[key]] = val;
  });

  playerDBObj.team = team.alias.toUpperCase();
  playerDBObj._id = playerID;
  console.log('Adding player ' +  playerDBObj._id);
  database.addPlayer(playerDBObj);
}

function addPlayerGameToDatabase(game, playerID, weekNum) {
  var stats = _.pick(game, attributes.game);
  stats.weekNum = weekNum;
  stats.player = playerID;
  stats._id = (playerID + '-' + weekNum).toUpperCase();
  console.log('Adding stats ' + stats._id);
  database.addGame(stats);
}

var nflStats = new NFLStats({
  api_key: 'mxe6x6n53uag',
  onReady: function() {
    database.dropAll();
    console.log('NFL Stats Ready');
    _.each(Array.apply(null, {length: NUMBER_OF_WEEKS})
      .map(Number.call, Number), function(weekNum) {
      weekNum += 1;
      console.log('Getting stats for week ' + weekNum);
      var count = 0;
      nflStats.week(weekNum, function(games) {
        _.each(games, function(game) {
          if (!game) {
            return;
          }
          console.log('Getting stats for game ' + count + ' for week ' + weekNum);
          count += 1;

          // Check if the home and away team exists in the db already
          // If it doesn't, then add it
          _.each(['home_team', 'away_team'], function(teamSide) {
            var team = game[teamSide];
            var teamID = team.alias.toUpperCase();
            database.team({ _id: teamID }, function(dbTeam) {
              if (!dbTeam) {
                addTeamToDatabase(team);
              }
            });

            _.each(game.players.players[teamSide], function(player) {

              // Check if the player is in the db
              // add it if it isn't
              var playerID = (teamID + player.player__number).toUpperCase();
              console.log('Looking at player ' + playerID);

              database.player({ _id: playerID }, function(dbPlayer) {
                if (!dbPlayer) {
                  addPlayerToDatabase(player, team);
                }
              });

              addPlayerGameToDatabase(player, playerID, weekNum);
            });
          });
        });
      });
    });
  }
});

