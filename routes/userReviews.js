var express = require('express')
var router = express.Router();

var http = require("http");
var https = require("https");

var DeathMatch = require('../models/DeathMatch.js');
var UserReview = require('../models/UserReview.js');
var User = require('../models/User.js');

router.post('/wroteReview', function(req, res){
	UserReview.find({$and: [{user: req.body.userInfo}, {deathMatch: req.body.deathMatch}] }, function(err, userReview){
		if (err || userReview[0]){return console.log(err) || res.send("written")}
		else{
			res.send("good to go")
		}
	})
})
router.put('/vote', function(req, res) {
	var vote = {};
	vote.id = req.body.reviewVotedForId;
	vote.polarity = req.body.voteValue;
	User.findOne({$and: [{_id: req.body.currentUserId, 'votes.id': vote.id}]},
	function(err, user){
		if (user){
			var oldVote = user.votes.filter(function(currentVote){
				return currentVote.id === vote.id;
			})
			console.log(`The original vote was ${oldVote[0].polarity} and the new vote is ${vote.polarity}`);
			// if(oldVote[0].polarity === vote.polarity){
			console.log("Time to revert vote");
			var revert = oldVote[0].polarity*-1;
			console.log("Ideal vote revert:", revert);
			UserReview.findByIdAndUpdate(req.body.reviewVotedForId, {$inc: {score: revert}}, function(err, userReview){
				if (userReview){
					User.findByIdAndUpdate(req.body.currentUserId, {$pull: {votes: oldVote[0]}},
						function(err, user){
							if(user){
								User.findByIdAndUpdate(req.body.authorVotedForId, { $inc: {score: revert}},
									function(err, user){
										if(user){
											res.send('GRATS')
										}
									})
								}
							})
						} else {
							console.log("Something else then");
						}
					})
					// }
				} else {
					UserReview.findByIdAndUpdate(req.body.reviewVotedForId, {$inc: {score: req.body.voteValue}},
						function(err, userReview){
							if (userReview){
								User.findByIdAndUpdate(req.body.currentUserId, {$push: {votes: vote}},
									function(err, user){
										if(user){
											User.findByIdAndUpdate(req.body.authorVotedForId, { $inc: {score: req.body.voteValue}},
												function(err, user){
													if(user){
														res.send('GRATS')
													}
												})
											}
										})
									} else {
										console.log("Something else then");
									}
								})
							}
						})
					})
					// router.post('/hasVoted', function(req, res){
					// 	User.find({$and: [{_id: req.body.userInfo}, {votes: req.body.deathMatch}]})
					// })
					// router.put('/upvote', function(req, res){
					// 	User.find({$and: [{_id: req.body.userInfo}, {deathMatches: req.body.deathMatch}] }, function(err, userReview){
					// 		if (err || userReview[0]){return console.log(err) || console.log("ALREADY VOTED");}
					// 		User.find({$and: [{_id: req.body.userInfo}, {votes: req.body.deathMatch}] }, function(err, userReview){
					// 			if (err || userReview[0]){return console.log(err) || console.log("ALREADY VOTED");}
					// 			else{
					// UserReview.findByIdAndUpdate(req.body.review, { $inc: {score: 1}}, function(err, userReview){
					// 					User.findByIdAndUpdate(req.body.criticId, { $inc: {score: 1}}, function(err, user) {
					// User.findByIdAndUpdate(req.body.userInfo,  {$push: {votes: req.body.deathMatch}}, function(err, user){
					// 							res.status(err ? 400 : 200).send(err || user)
					// 						})
					// 					})
					// 				})
					// 			}
					// 		})
					// 	})
					// })
					// router.put('/downvote', function(req, res){
					// 	User.find({$and: [{_id: req.body.userInfo}, {deathMatches: req.body.deathMatch}] }, function(err, userReview){
					// 		if (err || userReview[0]){return console.log(err) || console.log("ALREADY VOTED");}
					// 		User.find({$and: [{_id: req.body.userInfo}, {votes: req.body.deathMatch}] }, function(err, userReview){
					// 			if (err || userReview[0]){return console.log(err) || res.send("voted");}
					// 			else{
					// 				UserReview.findByIdAndUpdate(req.body.review, { $inc: {score: -1}}, function(err, userReview){
					// 					User.findByIdAndUpdate(req.body.criticId, { $inc: {score: -1}}, function(err, user) {
					// 						User.findByIdAndUpdate(req.body.userInfo,  {$pull: {votes: req.body.deathMatch}}, function(err, user){
					// 							res.status(err ? 400 : 200).send(err || user)
					// 						})
					// 					})
					// 				})
					// 			}
					// 		})
					// 	})
					// })

					module.exports = router;
