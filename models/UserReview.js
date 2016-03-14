'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserReview;

var userReviewSchema = Schema({
	deathMatch: {type: Schema.Types.ObjectId, ref: "DeathMatch"},
	user: {type: Schema.Types.ObjectId, ref: "User"},
	review: {type: String},
	game: {type: String},
	timestamp : { type : Date, default: Date.now },
	score: {type: Number, default: 0}
});



userReviewSchema.statics.make = function(userReview, cb){
	var deathMatch = userReview.deathMatch
	var user = userReview.user
	var review = userReview.review
	var game = userReview.gameName
	console.log("WE got itt, right?", game);
	UserReview.find({$and: [{user: user}, {deathMatch: deathMatch}] }, function(err, userReview){
		if (err || userReview[0]){return console.log(err) || console.log("A review has already been written by this user for this battle!")}
		console.log("Here it is", userReview);
		var newUserReview = new UserReview;
		newUserReview.deathMatch = deathMatch;
		newUserReview.user = user;
		newUserReview.review = review;
		newUserReview.game = game;
		// newDeathMatch.user = user;
		console.log("Thank you for your contribution", newUserReview)
		newUserReview.save(function(err, savedUserReview){
			console.log('saved review: ', savedUserReview)
			console.log(err);
			cb(err, savedUserReview)
		})
	})
};
// userReviewSchema.statics.vote = function(userReview, cb){
// 	var user = userReview.user
// 	var review = userReview.review
// 	UserReview.find({$and: [{user: user}, {deathMatch: deathMatch}] }, function(err, userReview){
// 		if (err || userReview[0]){return console.log(err) || console.log("A review has already been written by this user for this battle!")}
// 		console.log("Here it is", userReview);
// 		var newUserReview = new UserReview;
// 		newUserReview.deathMatch = deathMatch;
// 		newUserReview.user = user;
// 		newUserReview.review = review;
// 		newUserReview.game = game;
// 		// newDeathMatch.user = user;
// 		console.log("Thank you for your contribution", newUserReview)
// 		newUserReview.save(function(err, savedUserReview){
// 			console.log('saved review: ', savedUserReview)
// 			console.log(err);
// 			cb(err, savedUserReview)
// 		})
// 	})
// };


UserReview = mongoose.model('UserReview', userReviewSchema);


module.exports = UserReview;
