var express = require('express')
var router = express.Router();

var http = require("http");
var https = require("https");

var Game = require('../models/Game.js');

var request = require('request');

var api_key = process.env.IGDB_KEY;
var api_key2 = process.env.MASH_KEY;
var unirest = require('unirest');

router.get('/', function(req, res){
	Game.find({}, function(err, game){
		res.send(game)
	})
})
router.post('/getTwoGames', function(req, res){
	var returnGames = {};
	Game.find({name: req.body.game1}, function(err, game){
		returnGames.game1 = game;
		Game.find({name: req.body.game2}, function(err, game){
			returnGames.game2 = game;
			res.send(returnGames)
		})
	})
})
router.post('/compare', function(req, res){
	// console.log("GET REQED!", req.body)	// console.log("REQED LENGTH!", req.body.length);
	var games = []
	var reads = 0;
	for(var key in req.body){
		var game = req.body[key]
		Game.find({name: game}, function(err, game){
			games.push(game);
			reads++;
			if(reads === 2){
				res.send(games)
			}
		})
	}
})
router.post('/', function(req, res){
	Game.register(req.body, function(err, game){
		res.send(game)
	})
})
router.get('/search/:term', function(req, res){
	var options = {
		host: 'www.igdb.com',
		path: `/api/v1/games/search?q=${req.params.term}`,
		port: '443',
		headers: {
			'Accept': 'application/json',
			'Authorization': `Token token=${api_key}`
		}
	};
	callback = function(response) {
		var str = ''
		response.on('data', function (chunk) {
			str += chunk;
		});
		response.on('end', function () {
			res.send(str)
		});
	}
	var req = https.request(options, callback);
	req.end();
})
router.get('/page/scores/:name', function(req, res){
	var name = req.params.name.replace(/\s+/g, '+').toLowerCase();
	name = name.replace(/\&/g, '%26');
	name = name.replace(":", '')
	name = name.replace("é", 'e')
	unirest.get(`https://ahmedakhan-game-review-information-v1.p.mashape.com/api/v1/information?game_name=${name}`)
	.header("X-Mashape-Key", `${api_key2}`)
	.header("Accept", "application/json")
	.end(function (result) {
		res.send(result.body);
	});
})
router.get('/page/stats/:id', function(req, res){
	var id = req.params.id;
	var name = req.params.name;
	var options = {
		host: 'www.igdb.com',
		path: `/api/v1/games/${id}`,
		port: '443',
		headers: {
			'Accept': 'application/json',
			'Authorization': `Token token=${api_key}`
		}
	};
	callback = function(response) {
		var str = ''
		response.on('data', function (chunk) {
			str += chunk;
		});
		response.on('end', function () {
			res.send(str)
		});
	}
	var req = https.request(options, callback);
	req.end();
})

router.post('/save'), function(req, res){
	Game.create(req.body.newGame, function(err, game){
		res.send(game)
	})
}

module.exports = router;
