'use strict';

angular.module('gameCompare')


.controller('deathMatchListCtrl', function($scope, $location, $rootScope, $state, $cookies, $http, ENV, DeathMatchService){
	DeathMatchService.load()
	.then( function victory(resp) {
		console.log("INFO:", resp.data);
		$scope.deathMatches = resp.data;
	}, function failure(err) {
		console.log(err);
	});
	$scope.comparing = function(score1, score2){
		if(Number(score1) > Number(score2) || isNaN(Number(score2)) ){
			return "isGreaterThan"
		} if(Number(score1) < Number(score2) || isNaN(Number(score1))) {
			return "isLessThan"
		} else {
			return "isEqualTo"
		}
	}
})
