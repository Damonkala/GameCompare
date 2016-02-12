var express = require('express')
var router = express.Router();

var http = require("http");
var https = require("https");

var DeathMatch = require('../models/DeathMatch.js');
var UserReview = require('../models/UserReview.js');

router.get('/', function(req, res){
	console.log("RETURNING ALL DEATH MATCHES");
	DeathMatch.find({}, function(err, deathMatch){
		res.send(deathMatch)
	}).populate('game1 game2')
})
router.post('/', function(req, res){
	console.log("MAKING A NEW DEATH MATCH", req.body);
	DeathMatch.make(req.body, function(err, deathMatch){
		res.send(deathMatch)
	})
})
router.get('/:id', function(req, res){
	console.log("DE ID", req.params.id);
	DeathMatch.findById(req.params.id, function(err, deathMatch) {
		res.status(err ? 400 : 200).send(err || deathMatch)
	}).populate('game1 game2 user game1UserReviews game2UserReviews')
})
router.put('/:id', function(req, res){
	console.log("got to route!", req.body);
	var game = req.body.game;
	UserReview.make(req.body, function(err, newReview){
		console.log("WE GOT A NEW REVIEW!!", newReview);
		if(game === 1){
			DeathMatch.findByIdAndUpdate(req.params.id, { $push: { game1UserReviews: newReview }}, function(err, deathMatch) {
				res.status(err ? 400 : 200).send(err || deathMatch)
			})
		}else {
			DeathMatch.findByIdAndUpdate(req.params.id, { $push: { game2UserReviews: newReview }}, function(err, deathMatch) {
				res.status(err ? 400 : 200).send(err || deathMatch)
			})
		}
	})
})



module.exports = router;
