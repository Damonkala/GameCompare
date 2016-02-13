'use strict';

var app = angular.module('gameCompare');

app.service('ScopeMaster', function($http, ENV, $location, $rootScope, $cookies, jwtHelper){
	this.setScopes = function(data){
		var trueGame = data;
		trueGame.cover = data.cover[0].url;

		trueGame.gameSpotCriticScore = data.gamespot[0].criticScore;
		trueGame.gameSpotUserScore = data.gamespot[0].userScore;
		trueGame.gameSpotUrl = data.gamespot[0].url;

		trueGame.gamesRadarCriticScore = data.gamesradar[0].criticScore;
		trueGame.gamesRadarUserScore = data.gamesradar[0].userScore;
		trueGame.gamesRadarUrl = data.gamesradar[0].url;

		trueGame.ignCriticScore = data.ign[0].criticScore;
		trueGame.ignUserScore = data.ign[0].userScore;
		trueGame.ignUrl = data.ign[0].url;

		trueGame.metacriticCriticScore = data.metacritic[0].criticScore;
		trueGame.metacriticUserScore = data.metacritic[0].userScore;
		trueGame.metacriticUrl = data.metacritic[0].url;

		var criticScore = [trueGame.gameSpotCriticScore, trueGame.gamesRadarCriticScore, trueGame.IgnCriticScore, trueGame.MetacriticCriticScore]
		function totalScore(scores) {
			var total = [];
			console.log("DO WE REALLY HAVE SCORE!?", scores);
			for(var i = 0; i<scores.length;i++){
				if(!Number(scores[i])){
					console.log("Not a real score", Number(scores[i]), scores[i]);
					total.push(0)
					console.log("Current total: fail:", total);
				} else {
					console.log("Is a real score", Number(scores[i]), scores[i]);
					total.push(Number(scores[i]))
					console.log("Current total: success:", total);
				}
			}
			return total.reduce(function(a, b){
				console.log("We totaled up, what's the problem?", a + b);
				return a + b;
			})
		}
		trueGame.totalCritic = totalScore([trueGame.gameSpotCriticScore, trueGame.gamesRadarCriticScore, trueGame.ignCriticScore, trueGame.metacriticCriticScore])

		trueGame.totalUser = totalScore([trueGame.gameSpotUserScore, trueGame.gamesRadarUserScore, trueGame.ignUserScore, trueGame.metacriticUserScore])

		console.log("DO WE HAVE CRITIC SCORE?", criticScore);
		console.log("DO WE HAVE A REAL CRITIC SCORE?", trueGame.totalCritic);
		console.log("DO WE HAVE A REAL USER SCORE?", trueGame.totalUser);
		console.log("TRUE FORM!", trueGame);
		return trueGame
	}
})
