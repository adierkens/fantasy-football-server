# fantasy-football-server
> A backend for the fantasy-football chrome extension

## Installation

Make sure you have [NodeJS](https://nodejs.org/en/) installed on your system.
The install instructions are on the node website.

To verify npm and node is working run:

```
% npm -v
2.14.4
% node -v
v4.1.1
```

### Install the dependencies for the project

From this directory run:
```
% npm install
```

This will download and install all the required dependencies listed in the package.json file and place them in a folder named `node_modules`

### Install MongoDB

Mongo is required for the backend to function.

####OSX
```
brew install mongo
```

#### Linux (Ubuntu)
```
sudo apt-get install mongodb
```

#### Windows
```
TBD
```

## Running

To connect to the database, the project uses 2 environment variables: `FF_MONGO_PASSWORD` and `FF_MONGO_USERNAME`
Make sure to set these before running the project:

```
export FF_MONGO_PASSWORD=footballfantasy
export FF_MONGO_USERNAME=footballfantasy
```

if no username or password is required to connect to mongo, these can be blank or unset.

Then use

```
npm start
```
to start the backend server. It uses the `PORT` environment variable, if set, or `8888` as the default

# API

### /player
> Retrieve a list of players matching the filter

Method: `POST`

Body:
> A json filter to match on the players collection - any mongodb filter works. Ex:

```
  {
    "position": "QB"
  }
```

Returns:
> A list of matching player objects Ex:

```
{
    "status": "success",
    "data": [
        {
            "_id": "NE12",
            "firstName": "Tom",
            "lastName": "Brady",
            "number": 12,
            "position": "QB",
            "team": "NE"
        },
        ...
        ...
```

### /stat
> Retrieve a list of player statistics matching the filter

Method: `POST`

Body:
> A json filter to match on the players and weeks collection - any mongodb filter works. Ex:

```
{
  "filter": {
    "player": {
      "_id": "NE12"
    },
    "week": {
        "weekNum": {
        "$in": [ 1, 3, 5 ]
        }
      }
}

```

Returns:
> A list of matching stat objects Ex:

```
{
    "status": "success",
    "data": {
        "weeks": {
            "1": {
                "count": 1,
                "weekNum": 1,
                "defense_assists": 0,
                "defense_forced_fumbles": 0,
                "defense_misc_assists": 0,
                "kick_return_touchdowns": 0,
                "kick_return_yards": 0,
                "kick_returns": 0,
                "kickoffs": 0,
                ...
                ...
```


### /userSave
> Retrieve a list of the player's saved graphs

Method: `POST`

Body:
> A json object containing the method to act upon the saved user graphs
> There are 3 possible operations: `ADD`, `GET`, `DELETE`

#### Get
> Gets the graphs for a given user
```
{
  "operation": "GET",
  "userID": "1437163-7"
}
```

#### Add
> Adds a new save for the given user
```
{
  "operation": "ADD",
  "savedGraph": {
    "userID": "1437163-7",
    "_id": "Test 1",
    "statFilters": [
      {
        "player": {
          "position": "QB",
          "team": "ARI",
          "_id": "ARI3"
        },
        "fields": {
          "label": "Passing Completions",
          "fields": [
            "passing_completions"
          ]
        }
      }
    ]
  }
}
```

#### Delete
> Deletes the given user saved graph

```
{
  "operation": "DELETE",
  "savedGraphID": "Test 3"
}
```


## Heroku Deployment

A working instance of this server is deployed to

# Database

A dump of the current database is located in the `backup` folder.
To restore your local mongod instance to this state run:

```
mongorestore -d fantasyfootball backup --drop
```

This will restore the `fantasyfootball` mongo database back to the saved state.

The database is split into 4 collections:

## players
> A collection of all players in the NFL

Ex.

```
{
    "_id": "NE12",
    "firstName": "Tom",
    "lastName": "Brady",
    "number": 12,
    "position": "QB",
    "team": "NE"
}
```

The `team` attribute is a foreign key to the `players` collection.

The `_id` attribute is a compund key derived from the team and player number.

## teams
> A collection of all teams in the NFL

Ex.

```
{
	"_id" : "ARI",
	"city" : "Arizona",
	"conference" : "NFC",
	"division" : "Western Division",
	"name" : "Cardinals",
	"logo_120x120" : "http://media.washingtonpost.com/wp-srv/sports/logos/nfl_arizona-cardinals_120.png",
	"logo_30x30" : "http://media.washingtonpost.com/wp-srv/sports/logos/nfl_arizona-cardinals_30.png",
	"logo_40x40" : "http://media.washingtonpost.com/wp-srv/sports/logos/nfl_arizona-cardinals_40.png",
	"logo_60x60" : "http://media.washingtonpost.com/wp-srv/sports/logos/nfl_arizona-cardinals_60.png",
	"primary_color" : "870619",
	"secondary_color" : "000000"
}
```

## games
> A collection of stats for each player for each week

Ex.

```
{
	"_id" : "ARI0-2",
	"defense_assists" : 0,
	"defense_forced_fumbles" : 0,
	"defense_misc_assists" : 0,
	"defense_misc_tackles" : 0,
	"fg_attempted" : 0,
	"fg_blocked" : 0,
	"fg_distances" : null,
	"fg_long" : 0,
	"fg_made" : 0,
	"fumble_fumbles" : 0,
	"fumble_lost_fumbles" : 0,
	"fumble_own_recovered" : 0,
	"fumble_own_recovered_td" : 0,
	"interception_return_attempts" : 0,
	"interception_return_long" : 0,
	"interception_return_long_td" : false,
	"interception_return_touchdowns" : 0,
	"interception_return_yards" : 0,
	"interceptions" : 0,
	"kick_return_long" : 0,
	"kick_return_long_td" : false,
	"kick_return_touchdowns" : 0,
	"kick_return_yards" : 0,
	"kick_returns" : 0,
	"kickoffs" : 0,
	"kickoffs_end_zone" : 0,
	"kickoffs_touchback" : 0,
	"opponent_fumbles_recovered" : 0,
	"opponent_fumbles_td" : 0,
	"opponent_fumbles_yards" : 0,
	"passing_attempts" : 0,
	"passing_completions" : 0,
	"passing_interceptions" : 0,
	"passing_long" : 0,
	"passing_long_td" : false,
	"passing_net_yards" : 0,
	"passing_sacked" : 0,
	"passing_touchdowns" : 0,
	"passing_yards" : 0,
	"passing_yards_lost" : 0,
	"penalty_penalties" : 0,
	"penalty_yards" : 0,
	"punt_return_long" : 0,
	"punt_return_long_td" : false,
	"punt_return_touchdowns" : 0,
	"punt_return_yards" : 0,
	"punt_returns" : 0,
	"punting_inside_20" : 0,
	"punting_long" : 0,
	"punting_return_yards" : 0,
	"punting_returns" : 0,
	"punting_touchbacks" : 0,
	"punting_yards" : 0,
	"punts" : 0,
	"punts_blocked" : 0,
	"receiving_long" : 0,
	"receiving_long_td" : false,
	"receiving_targets" : 0,
	"receiving_tds" : 0,
	"receiving_yards" : 0,
	"receptions" : 0,
	"return_total_touchdowns" : 0,
	"return_total_yards" : 0,
	"rushing_attempts" : 0,
	"rushing_long" : 0,
	"rushing_long_td" : false,
	"rushing_touchdowns" : 0,
	"rushing_yards" : 0,
	"safeties" : 0,
	"two_point_conversions" : 0,
	"two_point_conversions_attempted" : 0,
	"xp_attempts" : 0,
	"xp_blocked" : 0,
	"xp_made" : 0,
	"weekNum" : 2,
	"player" : "ARI0"
}
```

The `_id`  attribute is a compound key derived from the playerId and the week the game took place.

The `player` attribute links to a player in the `player` collection

All fields, with the exception of _id, player, and weekNum are optional and dependent on the player's position and the events that took place in that particular game. Any stat not included is assumed to be 0.

## userSavedGraphs
> A collection of the saved graphs

Ex.

```
{
	"_id" : "1437163-7-Cardinals",
	"label": "Cardinals",
	"userID" : "1437163-7",
	"statFilters" : [
		{
			"player" : {
				"position" : "RB",
				"team" : "ARI"
			},
			"fields" : {
				"label" : "Rushing Touchdowns",
				"fields" : [
					"rushing_touchdowns"
				]
			}
		},
		{
			"player" : {
				"position" : "RB",
				"team" : "ARI",
				"_id" : "ARI31"
			},
			"fields" : {
				"label" : "Rushing Touchdowns",
				"fields" : [
					"rushing_touchdowns"
				]
			}
		}
	]
}
```

The `_id` field is a compound key derived from the `userID` and the `label` attributes.

The `label` attribute is the title of the user's graph

The `statFilters` array is all of the filters needed to reconstruct the saved graph.

The `userID` field is the ESPN id of that particular user's fantasy team in a particular league.