'use strict';

angular.module('gameCompare')


.controller('deathMatchListCtrl', function($scope, $location, $rootScope, $state, $cookies, $http, DeathMatchService, GameService){
	DeathMatchService.load()
	.then( function victory(resp) {
		console.log("INFO:", resp.data);
		deathMatches = resp.data;
		$scope.deathMatches = resp.data;
	}, function failure(err) {
		console.log(err);
	});
	var deathMatches;
	$scope.comparing = function(score1, score2){
		return GameService.compareGames(score1, score2)
	}
	$scope.$watch(function(){return $scope.searchTerm}, function(n,o){
		$scope.updateSearch();
	})
	$scope.updateSearch = function(searchTerm){
		if(searchTerm){
		$scope.deathMatches = $scope.deathMatches.filter(function(deathMatch){
			if (deathMatch.game1.name.toLowerCase().match(searchTerm.toLowerCase()) || deathMatch.game2.name.toLowerCase().match(searchTerm.toLowerCase()) || deathMatch.user.name.toLowerCase().match(searchTerm.toLowerCase())){
				return true
			} else{
				return false
			}
		})
		} else{
			$scope.deathMatches = deathMatches
		}
	}
})
