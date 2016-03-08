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
		var randomPair = $scope.game.names[Math.floor(Math.random()*$scope.game.names.length)];
		console.log(randomPair.name);
	}




})
