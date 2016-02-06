'use strict';

angular.module('gameCompare')

.controller('gameCtrl', function($scope, $http, ENV){
	$http.get(`${ENV.API_URL}/games/`).then( function victory(resp) {
		console.log("INFO:", resp.data);
		$scope.dbGames = resp.data;
	}, function failure(err) {
		console.log(err);
	});
	$scope.comparing = function(score1, score2){
		// var ign1 = Number($scope.gameOne.ign[0].criticScore);
		// var ign2 = Number($scope.gameTwo.ign[0].criticScore);
		if(Number(score1) > Number(score2)){
			return "isGreaterThan"
		} if(Number(score1) < Number(score2)) {
			return "isLessThan"
		} else {
			return "isEqualTo"
		}
	}
	$scope.total = function(){
		// $scope.gameOne.ign[0].criticScore = $scope.gameOne.ign[0].criticScore.replace("-.-", 0);
		// console.log($scope.gameOne.gamespot[0].criticScore, $scope.gameOne.ign[0].criticScore, $scope.gameOne.gamesradar[0].criticScore, $scope.gameOne.metacritic[0].criticScore);
		$scope.gameOneCriticTotal = (
			Number($scope.gameOne.gamespot[0].criticScore) +
			Number($scope.gameOne.ign[0].criticScore.replace("-.-", 0)) +
			Number($scope.gameOne.gamesradar[0].criticScore) +
			Number($scope.gameOne.metacritic[0].criticScore)
		)
		$scope.gameTwoCriticTotal = (
			Number($scope.gameTwo.gamespot[0].criticScore) +
			Number($scope.gameTwo.ign[0].criticScore) +
			Number($scope.gameTwo.gamesradar[0].criticScore) +
			Number($scope.gameTwo.metacritic[0].criticScore)
		)
		// $scope.gameOne.ign[0].userScore = $scope.gameOne.ign[0].userScore.replace("-.-", 0);
		$scope.gameOneUserTotal = (
			Number($scope.gameOne.gamespot[0].userScore) +
			Number($scope.gameOne.ign[0].userScore) +
			Number($scope.gameOne.gamesradar[0].userScore) +
			Number($scope.gameOne.metacritic[0].userScore)
		)
		$scope.gameTwoUserTotal = (
			Number($scope.gameTwo.gamespot[0].userScore) +
			Number($scope.gameTwo.ign[0].userScore) +
			Number($scope.gameTwo.gamesradar[0].userScore) +
			Number($scope.gameTwo.metacritic[0].userScore)
		)
	}
	$scope.search = function(term){
		term = term.replace(/\s+/g, '-').toLowerCase();
		$http.get(`${ENV.API_URL}/games/search/${term}`).then( function victory(resp) {
			console.log("INFO:", resp.data.games);
			$scope.games = resp.data.games;
		}, function failure(err) {
			console.log(err);
		});
	}
	$scope.getProperReview = function(choice){
		console.log("GET REVIEWWWWW", choice);
		$http.get(`${ENV.API_URL}/games/page/scores/${choice}`).then( function victory(resp) {
			console.log("RETURN!", resp);
		}, function failure(err) {
			console.log(err);
		});
	}
	$scope.openGame = function(id, name){
		$http.get(`${ENV.API_URL}/games/page/stats/${id}`).then( function victory(resp) {
			console.log("NEW INFO:", resp);
			$scope.gameInfo = resp.data.game;
		}, function failure(err) {
			console.log(err);
		});

		$http.get(`${ENV.API_URL}/games/page/scores/${name}`).then( function victory(resp) {
			console.log("SCORES!", resp.data.result);
			console.log("Massage:", resp.data.message);
			console.log("DAAATAAA:", resp.data.possibleChoices);
			if(!resp.data.message){
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
			$scope.gameOne = resp.data[0][0];
			$scope.gameTwo = resp.data[1][0];
			$scope.gameOne.ign[0].criticScore = $scope.gameOne.ign[0].criticScore.replace("-.-", 0);
			$scope.gameTwo.ign[0].criticScore = $scope.gameTwo.ign[0].criticScore.replace("-.-", 0);
			$scope.gameOne.ign[0].userScore = $scope.gameOne.ign[0].userScore.replace("-.-", 0);
			$scope.gameTwo.ign[0].userScore = $scope.gameTwo.ign[0].userScore.replace("-.-", 0);
			if(!$scope.gameOne.gamesradar[0].userScore){
				$scope.gameOne.gamesradar[0].userScore = 0;
			}
			if(!$scope.gameOne.metacritic[0].userScore){
				$scope.gameOne.metacritic[0].userScore = 0;
			}
			if(!$scope.gameTwo.metacritic[0].userScore){
				$scope.gameTwo.metacritic[0].userScore = 0;
			}
			if(!$scope.gameTwo.gamesradar[0].userScore){
				$scope.gameTwo.gamesradar[0].userScore = 0;
			}
			$scope.total();
		}, function failure(err){
			console.log(err);
		})
	}
})
