'use strict';

var app = angular.module('gameCompare');

app.service('GameService', function($http, ENV, $location, $rootScope, $cookies, jwtHelper){
	this.load = function(){
		return $http.get(`${ENV.API_URL}/games/`)
	};
	this.openGame = function(id){
		return $http.get(`${ENV.API_URL}/games/page/stats/${id}`)
	};
	this.searchGame = function(term){
		return $http.get(`${ENV.API_URL}/games/search/${term}`)
	};
	this.startBattle = function(){
		return $http.post(`${ENV.API_URL}/deathMatches`, deathmatch)
	};
	this.startBattle = function(games){
		return $http.post(`${ENV.API_URL}/games/compare`, games)
	};
	this.getScore = function(name){
		return $http.get(`${ENV.API_URL}/games/page/scores/${name}`)
	};
	this.saveGame = function(newGame){
		return $http.post(`${ENV.API_URL}/games`, newGame)
	};
	this.compareGames = function(score1, score2){
		if(Number(score1) > Number(score2) || isNaN(Number(score2)) ){
			return "isGreaterThan"
		} if(Number(score1) < Number(score2) || isNaN(Number(score1))) {
			return "isLessThan"
		} else {
			return "isEqualTo"
		}
	}
	// this.totalScore = function()
})
