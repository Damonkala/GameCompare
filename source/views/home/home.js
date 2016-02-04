'use strict';

angular.module('gameCompare')

.controller('homeCtrl', function($scope, $http, ENV){
	$http.get(`${ENV.API_URL}/games/`).then( function victory(resp) {
		console.log("INFO:", resp.data);
		$scope.dbGames = resp.data;
	}, function failure(err) {
		console.log(err);
	});
	$scope.search = function(term){
		term = term.replace(/\s+/g, '-').toLowerCase();
		$http.get(`${ENV.API_URL}/games/search/${term}`).then( function victory(resp) {
			console.log("INFO:", resp.data.games);
			$scope.games = resp.data.games;
		}, function failure(err) {
			console.log(err);
		});
	}
	// $scope.scrape = function(name){
	// 	$http.get(`${ENV.API_URL}/games/page/${name}`).then( function victory(resp) {
	// 		console.log("NEW INFO:", resp.data.game);
	// 		$scope.gameInfo = resp.data.game;
	// 	}, function failure(err) {
	// 		console.log(err);
	// 	});
	// }
	$scope.openGame = function(id, name){
		$http.get(`${ENV.API_URL}/games/page/stats/${id}`).then( function victory(resp) {
			console.log("NEW INFO:", resp);
			$scope.gameInfo = resp.data.game;
		}, function failure(err) {
			console.log(err);
		});

		$http.get(`${ENV.API_URL}/games/page/scores/${name}`).then( function victory(resp) {
			console.log("SCORES!", resp.data.result);
			var scoreData = resp.data.result;
			$scope.gamespot = scoreData.gamespot
			$scope.gamesradar = scoreData.gamesradar
			$scope.ign = scoreData.ign
			$scope.metacritic = scoreData.metacritic
		}, function failure(err) {
			console.log(err);
		});
	}
	$scope.saveGame = function(){
		var newGame = {}
		newGame.companies = $scope.gameInfo.companies
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

	$scope.compare = function(game1, game2){
		var games = {}
		games.game1 = game1;
		games.game2 = game2;
		console.log("Comparison", games);
		$http.post(`${ENV.API_URL}/games/compare`, games).then(function victory(resp){
			// console.log("Gam1", resp.data[0][0]);
			// console.log("Gam2", resp.data[1][0]);
			$scope.gameOne = resp.data[0][0];
			$scope.gameTwo = resp.data[1][0];
		}, function failure(err){
			console.log(err);
		})
	}
})
