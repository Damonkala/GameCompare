'use strict';

angular.module('gameCompare')


.controller('deathMatchListCtrl', function($scope, $location, $rootScope, $state, $cookies, $http, ENV, DeathMatchService, GameService){
	DeathMatchService.load()
	.then( function victory(resp) {
		console.log("INFO:", resp.data);
		$scope.deathMatches = resp.data;
	}, function failure(err) {
		console.log(err);
	});
	$scope.comparing = function(score1, score2){
		return GameService.compareGames(score1, score2)
	}
})
