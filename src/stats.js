var database = require('./database');
var fetch = require('./fetch');
var _ = require('lodash');

var sampleStatObj = {
    filter: {
        player: {
            team: "NE",
            position: "QB"
        },
        week: {
            weekNum: {
                $in: [1, 10]
            }
        }
    }
};

module.exports = function(statObj, callback) {


    statObj.filter = statObj.filter || {};
    statObj.filter.player = statObj.filter.player || {};
    statObj.filter.week = statObj.filter.week || {};

    var response = {
        weeks: {}
    };

    var requestsInFlight = 0;

    // Find all the players that match the search obj
    
    fetch.player(statObj.filter.player, function(players) {
        _.each(players, function(player) {
            // For each of the players grab their weekly stats

            var weekFilter = JSON.parse(JSON.stringify(statObj.filter.week));
            weekFilter.player = player._id;

            requestsInFlight += 1;
            
            database.games(weekFilter, function(games) {
                requestsInFlight -=1;

                _.each(games, function (game) {

                    var weekNum = game.weekNum;

                    if (!response.weeks[weekNum]) {
                        response.weeks[weekNum] = {
                            count: 0,
                            weekNum: weekNum
                        };
                    }

                    _.forEach(game, function (stat, gameKey) {

                        if (gameKey === "_id" ||
                            gameKey === "player" ||
                            gameKey === "weekNum" ) {
                            return;
                        }
                        
                        if (typeof stat !== 'number') {
                            return;
                        }

                        if (!response.weeks[weekNum][gameKey]) {
                            response.weeks[weekNum][gameKey] = stat;
                        } else {
                            response.weeks[weekNum][gameKey] += stat;
                        }

                    });

                    response.weeks[weekNum].count += 1;
                    
                });

                if (requestsInFlight === 0) {

                    _.forEach(response.weeks, function(statsObj, weekNum) {

                        var totalCount = statsObj.count;

                        response.weeks[weekNum] = _.mapValues(statsObj, function(value, key) {
                            if (key === "weekNum" || key === "count") {
                                return value;
                            }
                            return value / totalCount;
                        });

                    });

                    response.filter = statObj.filter;

                    callback(response);

                }

            });

        });
        
    });

};