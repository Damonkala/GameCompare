'use strict';

angular.module('gameCompare')


.controller('deathMatchPageCtrl', function($scope, $state, UserService, $cookies, jwtHelper, $location , $base64, $http, ENV, DeathMatchService, GameService, ScopeMaster){
	console.log("WO HO");
	console.log("PURAMS", $state.params.id);
	var cookies = $cookies.get('token');
	if(cookies){
		$scope.userInfo = (jwtHelper.decodeToken(cookies))
	}
	UserService.isAuthed(cookies)
	.then(function(res , err){
		// console.log(res.data)
		if (res.data === "authRequired"){
			//  $location.path('/login')
		} else {
			$scope.isLoggedIn = true;
			$scope.hasWrittenReview($scope.userInfo._id, $state.params.id)
		}
	})
	$scope.hasWrittenReview = function(userId, deathMatchId){
		UserService.wroteReview(userId, deathMatchId)
		.then(function(res , err){
			if (res.data === "written"){
				$scope.wroteReview = true;
			} else {
				$scope.wroteReview = false;
			}
		})
	}

	DeathMatchService.openMatch($state.params.id)
	.then( function victory(resp) {
		$scope.deathMatchId = $state.params.id;
		console.log("INFO:", resp.data);
		$scope.gameOne = ScopeMaster.setScopes(resp.data.game1)
		$scope.gameTwo = ScopeMaster.setScopes(resp.data.game2)
		$scope.game1UserReviews = resp.data.game1UserReviews
		$scope.game2UserReviews = resp.data.game2UserReviews
	}, function failure(err) {
		console.log(err);
	});

	$scope.upvote = function(gameId, criticId){
		DeathMatchService.upvote($scope.userInfo._id, $scope.deathMatchId, gameId, criticId)
	}
	$scope.downvote = function(gameId, criticId){
		DeathMatchService.downvote($scope.userInfo._id, $scope.deathMatchId, gameId, criticId)
	}

	$scope.writeReview = function(content, game, gameName){
		console.log("GORM!", gameName);
		if(content){
			console.log("is it game", game);
			var review = {}
			review.gameName = gameName;
			review.game = game
			review.deathMatch = $state.params.id;
			review.user = $scope.userInfo._id;
			review.review = content;
			DeathMatchService.writeReview($state.params.id, review).then( function victory(resp){
				DeathMatchService.openMatch(resp.data._id)
				.then( function victory(resp) {
					console.log("INFO:", resp.data);
					$scope.gameOne = ScopeMaster.setScopes(resp.data.game1)
					$scope.gameTwo = ScopeMaster.setScopes(resp.data.game2)
					$scope.game1UserReviews = resp.data.game1UserReviews
					$scope.game2UserReviews = resp.data.game2UserReviews
					$state.go($state.current, {}, {reload: true});
				}, function failure(err) {
					console.log(err);
				});
			}), function failure(err){
				console.log("O no ", err);
			}
		} else {
			swal({
				type: "error",
				title: "I'm sorry",
				text: "Did you want to write a review? Then write one."
			});
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
			userReviews: "=",
			gameNum: "=",
			gameName: "=",
		},
		templateUrl: "views/death-match-view.html"
	};
})
