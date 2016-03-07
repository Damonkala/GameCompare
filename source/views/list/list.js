'use strict';

angular.module('gameCompare')

.controller('listCtrl', function($scope, $http, ENV){
	$http.get(`${ENV.API_URL}/games/`).then( function victory(resp) {
		$scope.dbGames = resp.data;

	}, function failure(err) {
		console.log(err);
	});

	$scope.game = {
		names: []
	}

	$scope.compareTwoGames = function() {
		// console.log("Hello");
		console.log($scope.game);
	}




})
