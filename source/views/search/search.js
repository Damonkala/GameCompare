'use strict';

angular.module('gameCompare')

.controller('searchCtrl', function($scope, $http, ENV){
	$scope.search = function(term){
		term = term.replace(/\s+/g, '-').toLowerCase();
		$http.get(`${ENV.API_URL}/games/search/${term}`).then( function victory(resp) {
			console.log("INFO:", resp.data.games);
			$scope.games = resp.data.games;
		}, function failure(err) {
			console.log(err);
		});
	}
	$scope.openGame = function(id, name){
		$http.get(`${ENV.API_URL}/games/page/stats/${id}`).then( function victory(resp) {
			// name = name.replace(/\s+/g, '-').toLowerCase();
			// name = name.replace(":", '')
			// name = name.replace(/^[^']*$/, '-')
			console.log("NEW INFO:", resp);
			$scope.url = `https://www.igdb.com/games/${resp.data.game.slug}`;
			// console.log("GAYMME.", `https://www.igdb.com/games/${name}`);
			$scope.gameInfo = resp.data.game;
		}, function failure(err) {
			console.log(err);
		});
		$scope.reviews = false;

		$http.get(`${ENV.API_URL}/games/page/scores/${name}`).then( function victory(resp) {
			$scope.reviews = false;
			console.log("SCORES!", resp.data.result);
			console.log("Massage:", resp.data.message);
			console.log("DAAATAAA:", resp.data.possibleChoices);
			if(!resp.data.message){
				$scope.reviews = true;
				var scoreData = resp.data.result;
				$scope.gamespot = scoreData.gamespot
				$scope.gamesradar = scoreData.gamesradar
				$scope.ign = scoreData.ign
				$scope.metacritic = scoreData.metacritic
			}
			$scope.choices = resp.data.possibleChoices
			console.log("choice", $scope.choices);
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

		$http.post(`${ENV.API_URL}/games`, newGame).then( function victory(resp) {
			console.log(resp.data)
		}, function failure(err) {
			console.log(err);
		});
	}
})
