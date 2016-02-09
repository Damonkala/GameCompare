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
		if(Number(score1) > Number(score2) || isNaN(Number(score2)) ){
			return "isGreaterThan"
		} if(Number(score1) < Number(score2) || isNaN(Number(score1))) {
			return "isLessThan"
		} else {
			return "isEqualTo"
		}
	}
	$scope.total = function(){
		console.log("Still broken?", $scope.gameOneIgnCritic);
		if(isNaN(Number($scope.gameOneIgnCritic))){
			console.log("IGN ONE CRITIC CHANGED");
			$scope.gameOneIgnCritic = 0;
		}
		if(isNaN(Number($scope.gameTwoIgnCritic))){
			console.log("IGN TWO CRITIC CHANGED");
			$scope.gameTwoIgnCritic = 0;
		}
		if(isNaN(Number($scope.gameOneIgnUser))){
			console.log("IGN ONE CRITIC CHANGED");
			$scope.gameOneIgnUser = 0;
		}
		if(isNaN(Number($scope.gameTwoIgnUser))){
			console.log("IGN TWO CRITIC CHANGED");
			$scope.gameTwoIgnUser = 0;
		}
		$scope.gameOneCriticTotal = (
			Number($scope.gameOneSpotCritic) +
			Number($scope.gameOneIgnCritic) +
			Number($scope.gameOneRadarCritic) +
			Number($scope.gameOneMetaCritic)
		)
		console.log("GAME ONE CRITIC TOTAL:", $scope.gameOneCriticTotal);
		$scope.gameTwoCriticTotal = (
			Number($scope.gameTwoSpotCritic) +
			Number($scope.gameTwoIgnCritic) +
			Number($scope.gameTwoRadarCritic) +
			Number($scope.gameTwoMetaCritic)
		)
		if (!$scope.gameOneRadarUser) {
			$scope.gameOneRadarUser = 0;
		}
		if (!$scope.gameTwoRadarUser) {
			$scope.gameTwoRadarUser = 0;
		}
		console.log("GAME TWO CRITIC TOTAL:", $scope.gameTwoCriticTotal);
		$scope.gameOneUserTotal = (
			Number($scope.gameOneSpotUser) +
			Number($scope.gameOneIgnUser) +
			Number($scope.gameOneRadarUser) +
			Number($scope.gameOneMetaUser)
		)
		console.log("GAME ONE USER TOTAL:", $scope.gameOneUserTotal);

		$scope.gameTwoUserTotal = (
			Number($scope.gameTwoSpotUser) +
			Number($scope.gameTwoIgnUser) +
			Number($scope.gameTwoRadarUser) +
			Number($scope.gameTwoMetaUser)
		)
		console.log("GAME TWO USER TOTAL:", $scope.gameTwoUserTotal);

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


	$scope.compare = function(game1, game2){
		var games = {}
		games.game1 = game1;
		games.game2 = game2;
		console.log("Comparison", games);
		$http.post(`${ENV.API_URL}/games/compare`, games).then(function victory(resp){
			$scope.gameOne = resp.data[0][0];
			$scope.gameTwo = resp.data[1][0];
			var gameOne = $scope.gameOne
			var gameTwo = $scope.gameTwo
			$scope.gameOneCover = gameOne.cover[0].url
			$scope.gameTwoCover = gameTwo.cover[0].url

			$scope.gameOneRadarCritic = gameOne.gamesradar[0].criticScore
			$scope.gameOneRadarUser = gameOne.gamesradar[0].userScore
			$scope.gameOneRadarUrl = gameOne.gamesradar[0].url

			$scope.gameTwoRadarCritic = gameTwo.gamesradar[0].criticScore
			$scope.gameTwoRadarUser = gameTwo.gamesradar[0].userScore
			$scope.gameTwoRadarUrl = gameTwo.gamesradar[0].url

			$scope.gameOneIgnCritic = gameOne.ign[0].criticScore
			console.log("BROKEN?!", $scope.gameOneIgnCritic);
			$scope.gameOneIgnUser = gameOne.ign[0].userScore
			$scope.gameOneIgnUrl = gameOne.ign[0].url

			$scope.gameTwoIgnCritic = gameTwo.ign[0].criticScore
			$scope.gameTwoIgnUser = gameTwo.ign[0].userScore
			$scope.gameTwoIgnUrl = gameTwo.ign[0].url

			$scope.gameOneMetaCritic = gameOne.metacritic[0].criticScore
			$scope.gameOneMetaUser = gameOne.metacritic[0].userScore
			$scope.gameOneMetaUrl = gameOne.metacritic[0].url

			$scope.gameTwoMetaCritic = gameTwo.metacritic[0].criticScore
			$scope.gameTwoMetaUser = gameTwo.metacritic[0].userScore
			$scope.gameTwoMetaUrl = gameTwo.metacritic[0].url


			$scope.gameOneSpotCritic = gameOne.gamespot[0].criticScore
			$scope.gameOneSpotUser = gameOne.gamespot[0].userScore
			$scope.gameOneSpotUrl = gameOne.gamespot[0].url

			$scope.gameTwoSpotCritic = gameTwo.gamespot[0].criticScore
			$scope.gameTwoSpotUser = gameTwo.gamespot[0].userScore
			$scope.gameTwoSpotUrl = gameTwo.gamespot[0].url


			$scope.total();
		}, function failure(err){
			console.log(err);
		})
	}
})
