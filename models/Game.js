'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Game;

var gameSchema = Schema({
	companies: Array,
	cover: Array,
	genres: Array,
	id: Number,
	name: String,
	releases: Array,
	summary: String,
	themes: Array,
	gamespot: Array,
	gamesradar: Array,
	ign: Array,
	metacritic: Array
});

// gameSchema.statics.search = function(term, cb){
// 	Game.find({name: term}, function(err, game){
// 		if (err || !game[0]){return console.log(err) || console.log("Game not in db")}
// 		cb(null, game);
// 	})
// }

gameSchema.statics.register = function(game, cb){
	var companies = game.companies;
	var cover = game.cover;
	var genres = game.genres;
	var id = game.id;
	var name = game.name;
	var releases = game.releases;
	var summary = game.summary;
	var themes = game.themes;
	var gamespot = game.gamespot;
	var gamesradar = game.gamesradar;
	var ign = game.ign;
	var metacritic = game.metacritic;

	Game.find({$or: [{id: id}, {name: name}] }, function(err, game){
		if (err || game[0]){return console.log(err) || console.log("Game is already in db")}
		var newGame = new Game;
		newGame.companies = companies;
		newGame.cover = cover;
		newGame.genres = genres;
		newGame.id = id;
		newGame.name = name;
		newGame.releases = releases;
		newGame.summary = summary;
		newGame.themes = themes;
		newGame.gamespot = gamespot;
		newGame.gamesradar = gamesradar;
		newGame.ign = ign;
		newGame.metacritic = metacritic;
		newGame.save(function(err, savedGame){
			console.log('saved user: ', savedGame)
			console.log(err);
			cb(err, savedGame)
		})
	})
};

Game = mongoose.model('Game', gameSchema);

module.exports = Game;
