'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deepPopulate = require('mongoose-deep-populate')(mongoose);

var DeathMatch;

var deathMatchSchema = Schema({
	game1: {type: Schema.Types.ObjectId, ref: "Game"},
	game2: {type: Schema.Types.ObjectId, ref: "Game"},
	game1UserReviews: [{type: Schema.Types.ObjectId, ref: "UserReview"}],
	game2UserReviews: [{type: Schema.Types.ObjectId, ref: "UserReview"}],
	user: {type: Schema.Types.ObjectId, ref: "User"},
});

deathMatchSchema.plugin(deepPopulate);

deathMatchSchema.statics.make = function(deathMatch, cb){
	console.log("BATTLE TO THE DEATH", deathMatch);
	var user = deathMatch.user
	var game1 = deathMatch.game1
	var game2 = deathMatch.game2
	DeathMatch.find({$and: [{game1: game1}, {game2: game2}] }, function(err, deathMatch){
		if (err || deathMatch[0]){return console.log(err) || console.log("DEATH MATCH IS ALREADY IN PROGRESS!")}
		console.log("HELLO NEW MATCH!", deathMatch);
		var newDeathMatch = new DeathMatch;
		newDeathMatch.user = user;
		newDeathMatch.game1 = game1;
		newDeathMatch.game2 = game2;
		// newDeathMatch.user = user;
		console.log("HOLA NEUVA DE MEURTO", newDeathMatch)
		newDeathMatch.save(function(err, savedDeathMatch){
			console.log('saved Death Match: ', savedDeathMatch)
			console.log(err);
			cb(err, savedDeathMatch)
		})
	})
};

DeathMatch = mongoose.model('DeathMatch', deathMatchSchema);


module.exports = DeathMatch;
