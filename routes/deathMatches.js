var express = require('express')
var router = express.Router();

var http = require("http");
var https = require("https");

var DeathMatch = require('../models/DeathMatch.js');
var UserReview = require('../models/UserReview.js');
var User = require('../models/User.js');

router.get('/', function(req, res){
	DeathMatch.find({}, function(err, deathMatch){
		res.send(deathMatch)
	}).populate('game1 game2 user')
})
router.post('/', function(req, res){
	DeathMatch.make(req.body, function(err, deathMatch){
		res.send(deathMatch)
		User.findByIdAndUpdate(deathMatch.user, { $push: { deathMatches: deathMatch }, $inc: {score: 1}}, function(err, deathMatch) {
			// res.status(err ? 400 : 200).send(err || deathMatch)
		})
	})
})
router.get('/:id', function(req, res){
	DeathMatch.findById(req.params.id).deepPopulate("game1UserReviews.user game2UserReviews.user game1 game2 user game1UserReviews game2UserReviews").exec(function(err, deathMatch) {
		res.status(err ? 400 : 200).send(err || deathMatch)
	})
})
router.put('/:id', function(req, res){
	var game = req.body.game;
	UserReview.make(req.body, function(err, newReview){
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



















module.exports = router;
