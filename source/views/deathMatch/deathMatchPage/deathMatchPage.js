'use strict';

angular.module('gameCompare')


.controller('deathMatchPageCtrl', function($scope, $state, UserService, $cookies, jwtHelper, $location , $base64, $http, ENV, DeathMatchService, GameService, ScopeMaster){
	console.log("WO HO");
	console.log("PURAMS", $state.params.id);
	var cookies = $cookies.get('token');
	if(cookies){
		$scope.userInfo = (jwtHelper.decodeToken(cookies))
		console.log("I AM ", $scope.userInfo);
	}
	UserService.isAuthed(cookies)
	.then(function(res , err){
		// console.log(res.data)
		if (res.data === "authRequired"){
			//  $location.path('/login')
		} else
		{$scope.isLoggedIn = true;}
	})
	DeathMatchService.openMatch($state.params.id)
	.then( function victory(resp) {
		console.log("INFO:", resp.data);
		// $scope.deathMatch = resp.data;
		$scope.gameOne = ScopeMaster.setScopes(resp.data.game1)
		$scope.gameTwo = ScopeMaster.setScopes(resp.data.game2)

		$scope.game1UserReviews = resp.data.game1UserReviews
		$scope.game2UserReviews = resp.data.game2UserReviews


	}, function failure(err) {
		console.log(err);
	});
	$scope.writeReview = function(content, game){
		console.log("is it game", game);
		var review = {}
		review.game = game
		review.deathMatch = $state.params.id;
		review.user = $scope.userInfo._id;
		review.review = content;
		DeathMatchService.writeReview($state.params.id, review).then( function victory(resp){
			console.log("HOORA", resp);
		}), function failure(err){
			console.log("O no ", err);
		}
	}
	$scope.comparing = function(score1, score2){
		return GameService.compareGames(score1, score2)
	}
})
.directive("deathMatchDirective", function() {
	return {
		restrict: 'AE',
		scope: {
			gameOne: "=",
			gameTwo: "=",
		},
		templateUrl: "views/death-match-view.html"
	};
})
// 'use strict';
//
// angular.module('gameCompare')
//
//
// .controller('deathMatchPageCtrl', function($scope, $state, UserService, $cookies, jwtHelper, $location , $base64, $http, ENV, DeathMatchService, GameService, ScopeMaster){
// 	console.log("WO HO");
// 	console.log("PURAMS", $state.params.id);
// 	var cookies = $cookies.get('token');
// 	if(cookies){
// 		$scope.userInfo = (jwtHelper.decodeToken(cookies))
// 		console.log("I AM ", $scope.userInfo);
// 	}
// 	UserService.isAuthed(cookies)
// 	.then(function(res , err){
// 		// console.log(res.data)
// 		if (res.data === "authRequired"){
// 			//  $location.path('/login')
// 		} else
// 		{$scope.isLoggedIn = true;}
// 	})
// 	DeathMatchService.openMatch($state.params.id)
// 	.then( function victory(resp) {
// 		console.log("INFO:", resp.data);
// 		// $scope.deathMatch = resp.data;
// 		$scope.gameOne = resp.data.game1;
// 		$scope.gameTwo = resp.data.game2;
//
// 		$scope.game1UserReviews = resp.data.game1UserReviews
// 		$scope.game2UserReviews = resp.data.game2UserReviews
//
// 		var gameOne = $scope.gameOne
// 		var gameTwo = $scope.gameTwo
// 		console.log("YOU ARE EL!", gameOne.url);
// 		$scope.gameOneurl = gameOne.url;
// 		$scope.gameTwourl = gameTwo.url;
// 		$scope.gameOneCover = gameOne.cover[0].url
// 		$scope.gameTwoCover = gameTwo.cover[0].url
//
// 		$scope.gameOneRadarCritic = gameOne.gamesradar[0].criticScore
// 		$scope.gameOneRadarUser = gameOne.gamesradar[0].userScore
// 		$scope.gameOneRadarUrl = gameOne.gamesradar[0].url
//
// 		$scope.gameTwoRadarCritic = gameTwo.gamesradar[0].criticScore
// 		$scope.gameTwoRadarUser = gameTwo.gamesradar[0].userScore
// 		$scope.gameTwoRadarUrl = gameTwo.gamesradar[0].url
//
// 		$scope.gameOneIgnCritic = gameOne.ign[0].criticScore
// 		console.log("BROKEN?!", $scope.gameOneIgnCritic);
// 		$scope.gameOneIgnUser = gameOne.ign[0].userScore
// 		$scope.gameOneIgnUrl = gameOne.ign[0].url
//
// 		$scope.gameTwoIgnCritic = gameTwo.ign[0].criticScore
// 		$scope.gameTwoIgnUser = gameTwo.ign[0].userScore
// 		$scope.gameTwoIgnUrl = gameTwo.ign[0].url
//
// 		$scope.gameOneMetaCritic = gameOne.metacritic[0].criticScore
// 		$scope.gameOneMetaUser = gameOne.metacritic[0].userScore
// 		$scope.gameOneMetaUrl = gameOne.metacritic[0].url
//
// 		$scope.gameTwoMetaCritic = gameTwo.metacritic[0].criticScore
// 		$scope.gameTwoMetaUser = gameTwo.metacritic[0].userScore
// 		$scope.gameTwoMetaUrl = gameTwo.metacritic[0].url
//
//
// 		$scope.gameOneSpotCritic = gameOne.gamespot[0].criticScore
// 		$scope.gameOneSpotUser = gameOne.gamespot[0].userScore
// 		$scope.gameOneSpotUrl = gameOne.gamespot[0].url
//
// 		$scope.gameTwoSpotCritic = gameTwo.gamespot[0].criticScore
// 		$scope.gameTwoSpotUser = gameTwo.gamespot[0].userScore
// 		$scope.gameTwoSpotUrl = gameTwo.gamespot[0].url
//
//
// 	}, function failure(err) {
// 		console.log(err);
// 	});
// 	$scope.writeReview = function(content, game){
// 		console.log("is it game", game);
// 		var review = {}
// 		review.game = game
// 		review.deathMatch = $state.params.id;
// 		review.user = $scope.userInfo._id;
// 		review.review = content;
// 		DeathMatchService.writeReview($state.params.id, review).then( function victory(resp){
// 			console.log("HOORA", resp);
// 		}), function failure(err){
// 			console.log("O no ", err);
// 		}
// 	}
// 	$scope.comparing = function(score1, score2){
// 		return GameService.compareGames(score1, score2)
// 	}
// })
// .directive("deathMatchDirective", function() {
// 	return {
// 		restrict: 'AE',
// 		scope: {
// 			gameOne: "=",
// 			gameTwo: "=",
// 		},
// 		templateUrl: "views/game-view.html"
// 	};
// })
