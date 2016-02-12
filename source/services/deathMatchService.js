'use strict';

var app = angular.module('gameCompare');

app.service('DeathMatchService', function($http, ENV, $location, $rootScope, $cookies, jwtHelper){
	this.load = function(){
		return $http.get(`${ENV.API_URL}/deathMatches/`)
	};
	this.openMatch = function(id){
		return $http.get(`${ENV.API_URL}/deathMatches/${id}`)
	};
	this.writeReview = function(id, review){
		return $http.put(`${ENV.API_URL}/deathMatches/${id}`, review)
	};
})