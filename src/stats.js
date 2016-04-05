var fetch = require('./fetch');

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
        filter: statObj.filter,
        weeks: new Array(16)
    };

    var requestsInFlight = 0;

    // Find all the players that match the search obj
    
    fetch.player(statObj.filter.player, function(players) {

        requestsInFlight -= 1;

        _.each(players, function(player) {
            // For each of the players grab their weekly stats

            var weekFilter = statObj.filter.week;
            weekFilter.player = player._id;

            fetch.games(weekFilter, function(games) {
                requestsInFlight -=1;

                _.each(games, function (game) {

                    var weekNum = game.weekNum;

                    if (!response.weeks[weekNum]) {
                        response.weeks[weekNum] = {
                            count: 0,
                            weekNum: weekNum
                        };
                    }

                    _.each(Object.keys(game), function (gameKey) {
                        var stat = game[gameKey];
                        
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

                var totalCount = response.weeks[weekNum].count;

                _.each(Object.keys(response.weeks[weekNum]), function(key) {
                    if (key === "count" ||
                        key === "weekNum") {
                        return;
                    }

                    response.weeks[weekNum][key] /= totalCount;
                });

                if (requestsInFlight === 0) {
                    callback(response);
                }
            });

            requestsInFlight += 1;
        });
        
    });

    requestsInFlight += 1;

};