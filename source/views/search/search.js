'use strict';

angular.module('gameCompare')

.controller('searchCtrl', function($scope, $http, ENV, GameService){
	$scope.search = function(term){
		term = term.replace(/\s+/g, '-').toLowerCase();
		GameService.searchGame(term).then( function victory(resp) {
			console.log("INFO:", resp.data.games);
			$scope.games = resp.data.games;
		}, function failure(err) {
			console.log(err);
		});
	}
	$scope.openGame = function(id, name){
		GameService.openGame(id).then( function victory(resp) {
			console.log("NEW INFO:", resp);
			$scope.url = `https://www.igdb.com/games/${resp.data.game.slug}`;
			$scope.gameInfo = resp.data.game;
		}, function failure(err) {
			console.log(err);
		});
		$scope.reviews = false;
		GameService.getScore(name)
		.then( function victory(resp) {
			$scope.reviews = false;
			if(!resp.data.message){
				$scope.reviews = true;
				var scoreData = resp.data.result;
				console.log("This just in ", scoreData);
				$scope.gamespot = scoreData.gamespot
				$scope.gamesradar = scoreData.gamesradar
				$scope.ign = scoreData.ign
				$scope.metacritic = scoreData.metacritic
			}
			$scope.choices = resp.data.possibleChoices
		}, function failure(err) {
			console.log(err);
		});
	}
	$scope.saveGame = function(){
		console.log("Shaving");
		var newGame = {}
		newGame.companies = $scope.gameInfo.companies
		newGame.url = $scope.url
		newGame.cover = $scope.gameInfo.cover
		newGame.genres = $scope.gameInfo.genres
		newGame.id = $scope.gameInfo.id
		newGame.name = $scope.gameInfo.name
		newGame.releases = $scope.gameInfo.release_dates
		newGame.summary = $scope.gameInfo.summary
		newGame.themes = $scope.gameInfo.themes

		newGame.gamespot = $scope.gamespot
		newGame.gamesradar = $scope.gamesradar
		newGame.ign = $scope.ign
		newGame.metacritic = $scope.metacritic
		console.log("spot", newGame.gamespot);
		console.log("radar", newGame.gamesradar);
		console.log("ign", newGame.ign);
		console.log("meta", newGame.metacritic);
		GameService.saveGame(newGame).then( function victory(resp) {
			console.log(resp.data)
		}, function failure(err) {
			console.log(err);
		});
	}
})
