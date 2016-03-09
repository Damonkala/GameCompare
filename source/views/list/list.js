'use strict';

angular.module('gameCompare')

.controller('listCtrl', function($scope, $http, ENV, $state){
	$http.get(`${ENV.API_URL}/games/`).then( function victory(resp) {
		$scope.dbGames = resp.data;

	}, function failure(err) {
		console.log(err);
	});

	$scope.game = {
		names: []
	}
	$scope.compareTwoGames = function() {
		if($scope.game.names.length > 2){
			var randomPair = {};
			randomPair.game1 = $scope.game.names[Math.floor(Math.random()*$scope.game.names.length)];
			randomPair.game2 = $scope.game.names[Math.floor(Math.random()*$scope.game.names.length)];
			if(randomPair.game1.name === randomPair.game2.name){
				console.log("A failure occured");
				$scope.compareTwoGames();
			} else {
				console.log("Random Game 1",randomPair.game1.name.replace(/\s+/g, '+').toLowerCase());
				console.log("Random Game 2",randomPair.game2.name.replace(/\s+/g, '+').toLowerCase());
				$state.go('game', {"game1": randomPair.game1.name, "game2": randomPair.game2.name})
			}
		} else {
			$state.go('game', {"game1": $scope.game.names[0].name, "game2": $scope.game.names[1].name})
		}
	}
})
