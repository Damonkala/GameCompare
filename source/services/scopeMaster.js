'use strict';

var app = angular.module('gameCompare');

app.service('ScopeMaster', function($http, ENV, $location, $rootScope, $cookies, jwtHelper){
	this.setScopes = function(data){
		var trueGame = data;
		// console.log("WHY HAVEN'T I LOGGED THIS YET!?", data);
		var noReview = {criticScore: 0, userScore: 0, url:null}
		trueGame.cover = data.cover ? data.cover[0].url : '//res.cloudinary.com/igdb/image/upload/t_thumb/nocover_qhhlj6.jpg';

		// console.log("DO WE HAVE GAMESPOT!?", data.gamespot);
		trueGame.gameSpotCriticScore = data.gamespot.length ? data.gamespot[0].criticScore : 0
		trueGame.gameSpotUserScore = data.gamespot.length ? data.gamespot[0].userScore : 0
		trueGame.gameSpotUrl = data.gamespot.length ? data.gamespot[0].url : undefined

		// console.log("DO WE HAVE GAMESRADAR!?", data.gamesradar);
		trueGame.gamesRadarCriticScore = data.gamesradar.length ? data.gamesradar[0].criticScore : 0
		trueGame.gamesRadarUserScore = data.gamesradar.length ? data.gamesradar[0].userScore : 0
		trueGame.gamesRadarUrl = data.gamesradar.length ? data.gamesradar[0].url : undefined

		// console.log("DO WE HAVE METACRITIC!?", data.metacritic);

		trueGame.metacriticCriticScore = data.metacritic.length ? data.metacritic[0].criticScore : 0
		trueGame.metacriticUserScore = data.metacritic.length ? data.metacritic[0].userScore : 0
		trueGame.metacriticUrl = data.metacritic.length ? data.metacritic[0].url : undefined

		// console.log("DO WE HAVE IGN!?", data.ign);
		trueGame.ignCriticScore = data.ign.length ? data.ign[0].criticScore : 0
		trueGame.ignUserScore = data.ign.length ? data.ign[0].userScore : 0
		trueGame.ignUrl = data.ign.length ? data.ign[0].url : undefined
		// if(data.gamespot){
		// 	trueGame.gameSpot = data.gamespot[0];
		// } else{
		// 	trueGame.gameSpot = noReview;
		// }
		// if(data.gamesradar){
		// 	trueGame.gamesRadar = data.gamesradar[0];
		// } else{
		// 	trueGame.gamesRadar = noReview;
		// }
		// trueGame.gamesRadarCriticScore = data.gamesradar[0].criticScore;
		// trueGame.gamesRadarUserScore = data.gamesradar[0].userScore;
		// trueGame.gamesRadarUrl = data.gamesradar[0].url;
		//
		// trueGame.ignCriticScore = data.ign[0].criticScore;
		// trueGame.ignUserScore = data.ign[0].userScore;
		// trueGame.ignUrl = data.ign[0].url;
		//
		// trueGame.metacriticCriticScore = data.metacritic[0].criticScore;
		// trueGame.metacriticUserScore = data.metacritic[0].userScore;
		// trueGame.metacriticUrl = data.metacritic[0].url;

		var criticScore = [trueGame.gameSpotCriticScore, trueGame.gamesRadarCriticScore, trueGame.ignCriticScore, trueGame.metacriticCriticScore]
		var userScore = [trueGame.gameSpotUserScore, trueGame.gamesRadarUserScore, trueGame.ignUserScore, trueGame.metacriticUserScore]

		function totalScore(scores) {
			var total = [];
			// console.log("DO WE REALLY HAVE SCORE!?", scores);
			for(var i = 0; i<scores.length;i++){
				if(!Number(scores[i])){
					// console.log("Not a real score", Number(scores[i]), scores[i]);
					total.push(0)
					// console.log("Current total: fail:", total);
				} else {
					// console.log("Is a real score", Number(scores[i]), scores[i]);
					total.push(Number(scores[i]))
					// console.log("Current total: success:", total);
				}
			}
			return total.reduce(function(a, b){
				// console.log("We totaled up, what's the problem?", a + b);
				return a + b;
			})
		}
		// trueGame.totalCritic = totalScore([trueGame.gameSpotCriticScore, trueGame.gamesRadarCriticScore, trueGame.ignCriticScore, trueGame.metacriticCriticScore])
		trueGame.totalCritic = totalScore(criticScore)
		trueGame.totalUser = totalScore(userScore)
		// trueGame.totalUser = totalScore([trueGame.gameSpotUserScore, trueGame.gamesRadarUserScore, trueGame.ignUserScore, trueGame.metacriticUserScore])

		// console.log("DO WE HAVE CRITIC SCORE?", criticScore);
		// console.log("DO WE HAVE A REAL CRITIC SCORE?", trueGame.totalCritic);
		// console.log("DO WE HAVE A REAL USER SCORE?", trueGame.totalUser);
		// console.log("TRUE FORM!", trueGame);
		return trueGame
	}
})
