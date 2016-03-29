'use strict';

var app = angular.module('gameCompare');

app.service('DeathMatchService', function($http, $location, $rootScope, $cookies, jwtHelper){
	this.load = function(){
		return $http.get(`/deathMatches/`)
	};
	this.openMatch = function(id){
		return $http.get(`/deathMatches/${id}`)
	};

})
