'use strict';

var app = angular.module('gameCompare');

app.service('DeathMatchService', function($http, $location, $rootScope, $cookies, jwtHelper){
	this.load = function(){
		return $http.get(`/deathMatches/`)
	};
	this.openMatch = function(id){
		return $http.get(`/deathMatches/${id}`)
	};
	this.writeReview = function(id, review){
		return $http.put(`/deathMatches/${id}`, review)
	};
	this.upvote = function(userId, deathMatch, review, criticId){
		return $http.put(`/deathMatches/upvote`, {"userInfo": userId, "deathMatch": deathMatch, "review": review, "criticId": criticId})
	}
	this.downvote = function(userId, deathMatch, review, criticId){
		return $http.put(`/deathMatches/downvote`, {"userInfo": userId, "deathMatch": deathMatch, "review": review, "criticId": criticId})
	}
})
