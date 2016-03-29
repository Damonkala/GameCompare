var express = require('express')
var router = express.Router();

var http = require("http");
var https = require("https");

var DeathMatch = require('../models/DeathMatch.js');
var UserReview = require('../models/UserReview.js');
var User = require('../models/User.js');

router.post('/wroteReview', function(req, res){
	console.log(`has ${req.body.userInfo} wrote a review for ${req.body.deathMatch}`);
	UserReview.find({$and: [{user: req.body.userInfo}, {deathMatch: req.body.deathMatch}] }, function(err, userReview){
		if (err || userReview[0]){return console.log(err) || res.send("written")}
		else{
			res.send("good to go")
		}
	})
})
router.post('/hasVoted', function(req, res){
	User.find({$and: [{_id: req.body.userInfo}, {votes: req.body.deathMatch}]})
})
router.put('/upvote', function(req, res){
	User.find({$and: [{_id: req.body.userInfo}, {deathMatches: req.body.deathMatch}] }, function(err, userReview){
		if (err || userReview[0]){return console.log(err) || console.log("ALREADY VOTED");}
		User.find({$and: [{_id: req.body.userInfo}, {votes: req.body.deathMatch}] }, function(err, userReview){
			if (err || userReview[0]){return console.log(err) || console.log("ALREADY VOTED");}
			else{
				console.log("Here we are");
				UserReview.findByIdAndUpdate(req.body.review, { $inc: {score: 1}}, function(err, userReview){
					console.log(userReview);
					User.findByIdAndUpdate(req.body.criticId, { $inc: {score: 1}}, function(err, user) {
						console.log(user);
						User.findByIdAndUpdate(req.body.userInfo,  {$push: {votes: req.body.deathMatch}}, function(err, user){
							console.log(user);
						})
					})
				})
			}
		})
	})
})
router.put('/downvote', function(req, res){
	User.find({$and: [{_id: req.body.userInfo}, {deathMatches: req.body.deathMatch}] }, function(err, userReview){
		if (err || userReview[0]){return console.log(err) || console.log("ALREADY VOTED");}
		User.find({$and: [{_id: req.body.userInfo}, {votes: req.body.deathMatch}] }, function(err, userReview){
			if (err || userReview[0]){return console.log(err) || res.send("voted");}
			else{
				UserReview.findByIdAndUpdate(req.body.review, { $inc: {score: -1}}, function(err, userReview){
					console.log(userReview);
					User.findByIdAndUpdate(req.body.criticId, { $inc: {score: -1}}, function(err, user) {
						console.log(user);
						User.findByIdAndUpdate(req.body.userInfo,  {$pull: {votes: req.body.deathMatch}}, function(err, user){
							console.log(user);
						})
					})
				})
			}
		})
	})
})

module.exports = router;
