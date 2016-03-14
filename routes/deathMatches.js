var express = require('express')
var router = express.Router();

var http = require("http");
var https = require("https");

var DeathMatch = require('../models/DeathMatch.js');
var UserReview = require('../models/UserReview.js');
var User = require('../models/User.js');

router.get('/', function(req, res){
	console.log("RETURNING ALL DEATH MATCHES");
	DeathMatch.find({}, function(err, deathMatch){
		res.send(deathMatch)
	}).populate('game1 game2 user')
})
router.post('/', function(req, res){
	console.log("MAKING A NEW DEATH MATCH", req.body);
	DeathMatch.make(req.body, function(err, deathMatch){
		res.send(deathMatch)
		User.findByIdAndUpdate(deathMatch.user, { $push: { deathMatches: deathMatch }, $inc: {score: 1}}, function(err, deathMatch) {
			// res.status(err ? 400 : 200).send(err || deathMatch)
		})
	})
})
router.post('/wroteReview', function(req, res){
	console.log(`has ${req.body.userInfo} wrote a review for ${req.body.deathMatch}`);
	UserReview.find({$and: [{user: req.body.userInfo}, {deathMatch: req.body.deathMatch}] }, function(err, userReview){
		if (err || userReview[0]){return console.log(err) || res.send("written")}
		else{
			res.send("good to go")
		}
	})
})
router.get('/:id', function(req, res){
	console.log("DE ID", req.params.id);
	DeathMatch.findById(req.params.id).deepPopulate("game1UserReviews.user game2UserReviews.user game1 game2 user game1UserReviews game2UserReviews").exec(function(err, deathMatch) {
		console.log("POP?", deathMatch);
		res.status(err ? 400 : 200).send(err || deathMatch)
	})
})
router.put('/:id', function(req, res){
	console.log("got to route!", req.body);
	var game = req.body.game;
	UserReview.make(req.body, function(err, newReview){
		console.log("WE GOT A NEW REVIEW!!", newReview);
		if(game === 1){
			DeathMatch.findByIdAndUpdate(req.params.id, { $push: { game1UserReviews: newReview }}).deepPopulate("game1UserReviews.user game2UserReviews.user game1 game2 user game1UserReviews game2UserReviews").exec(function(err, deathMatch) {
				res.status(err ? 400 : 200).send(err || deathMatch)
			})
		}else {
			DeathMatch.findByIdAndUpdate(req.params.id, { $push: { game2UserReviews: newReview }}).deepPopulate("game1UserReviews.user game2UserReviews.user game1 game2 user game1UserReviews game2UserReviews").exec(function(err, deathMatch) {
				res.status(err ? 400 : 200).send(err || deathMatch)
			})
		}
		User.findByIdAndUpdate(newReview.user, { $push: { reviews: newReview }, $inc: {score: 1}}, function(err, deathMatch) {
			// res.status(err ? 400 : 200).send(err || deathMatch)
		})
	})
})
router.put('/:deathmatchId', function(req, res){
	UserReview.findById(req.params.deathmatchId, { $inc: {score: 1}}, function(err, review){

	})
})


module.exports = router;
