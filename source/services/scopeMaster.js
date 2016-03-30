'use strict';

var app = angular.module('gameCompare');

app.service('ScopeMaster', function($http, $location, $rootScope, $cookies, jwtHelper){
	this.setScopes = function(data){
		var trueGame = data;
		var noReview = {criticScore: 0, userScore: 0, url:null}
		trueGame.cover = data.cover ? data.cover[0].url : '//res.cloudinary.com/igdb/image/upload/t_thumb/nocover_qhhlj6.jpg';

		trueGame.gameSpotCriticScore = data.gamespot.length ? data.gamespot[0].criticScore : 0
		trueGame.gameSpotUserScore = data.gamespot.length ? data.gamespot[0].userScore : 0
		trueGame.gameSpotUrl = data.gamespot.length ? data.gamespot[0].url : undefined

		trueGame.gamesRadarCriticScore = data.gamesradar.length ? data.gamesradar[0].criticScore : 0
		trueGame.gamesRadarUserScore = data.gamesradar.length ? data.gamesradar[0].userScore : 0
		trueGame.gamesRadarUrl = data.gamesradar.length ? data.gamesradar[0].url : undefined

		trueGame.metacriticCriticScore = data.metacritic.length ? data.metacritic[0].criticScore : 0
		trueGame.metacriticUserScore = data.metacritic.length ? data.metacritic[0].userScore : 0
		trueGame.metacriticUrl = data.metacritic.length ? data.metacritic[0].url : undefined

		trueGame.ignCriticScore = data.ign.length ? data.ign[0].criticScore : 0
		trueGame.ignUserScore = data.ign.length ? data.ign[0].userScore : 0
		trueGame.ignUrl = data.ign.length ? data.ign[0].url : undefined

		var criticScore = [trueGame.gameSpotCriticScore, trueGame.gamesRadarCriticScore, trueGame.ignCriticScore, trueGame.metacriticCriticScore]
		var userScore = [trueGame.gameSpotUserScore, trueGame.gamesRadarUserScore, trueGame.ignUserScore, trueGame.metacriticUserScore]

		function totalScore(scores) {
			var total = [];

			for(var i = 0; i<scores.length;i++){
				if(!Number(scores[i])){
					total.push(0)
				} else {
					total.push(Number(scores[i]))
				}
			}
			return total.reduce(function(a, b){
				return a + b;

			})
		}
		trueGame.totalCritic = totalScore(criticScore)
		trueGame.totalUser = totalScore(userScore)

		return trueGame
	}
})
