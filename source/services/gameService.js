'use strict';

var app = angular.module('gameCompare');

app.service('GameService', function($http, $location, $rootScope, $cookies, jwtHelper){
	this.load = function(){
		return $http.get(`/games/`)
	};
	this.openGame = function(id){
		return $http.get(`/games/page/stats/${id}`)
	};
	this.searchGame = function(term){
		return $http.get(`/games/search/${term}`)
	};
	this.startBattle = function(deathmatch){
		return $http.post(`/deathMatches`, deathmatch)
	};
	this.startBattle = function(games){
		return $http.post(`/games/compare`, games)
	};
	this.getScore = function(name){
		return $http.get(`/games/page/scores/${name}`)
	};
	this.saveGame = function(newGame){
		return $http.post(`/games`, newGame)
	};
	this.getGames = function(games){
		return $http.post(`/games/getTwoGames`, games)
	}
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
