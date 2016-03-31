'use strict';

angular.module('gameCompare')


.controller('deathMatchPageCtrl', function($scope, $state, UserService, $cookies, jwtHelper, $location , $base64, $http, DeathMatchService, GameService, ScopeMaster, UserReviewService, $timeout){
	var cookies = $cookies.get('token');
	if(cookies){
		$scope.userInfo = (jwtHelper.decodeToken(cookies))
	}
	UserService.isAuthed(cookies)
	.then(function(res , err){
		if (res.data === "authRequired"){
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
	$scope.hasVoted = function(userId, reviewId){
		UserReviewService.hasVoted(userId, reviewId)
		.then(function(res, err){
			if(res.data === "voted"){
				return "hasVoted";
			} else {
				return
			}
		})
	}
	$scope.init = function(){
		DeathMatchService.openMatch($state.params.id)
		.then( function victory(resp) {
			$scope.deathMatchId = $state.params.id;
			$scope.gameOne = ScopeMaster.setScopes(resp.data.game1)
			$scope.gameTwo = ScopeMaster.setScopes(resp.data.game2)
			$scope.game1UserReviews = resp.data.game1UserReviews
			$scope.game2UserReviews = resp.data.game2UserReviews
		}, function failure(err) {
			console.log(err);
		});
	}
	$scope.init()
	$scope.vote = function(userReviewId, authorId, val){
		console.log(`${$scope.userInfo._id} (you) are going to vote for ${authorId}'s review: ${userReviewId}, and the vote will be ${val}' `);
		UserReviewService.vote($scope.userInfo._id, userReviewId, authorId, val)
		.then(function victory(resp){
			$timeout(function() {
				$scope.init();
			});
		})
	}

	$scope.writeReview = function(content, game, gameName){
		if(content){
			var review = {}
			review.gameName = gameName;
			review.game = game
			review.deathMatch = $state.params.id;
			review.user = $scope.userInfo._id;
			review.review = content;
			UserReviewService.writeReview($state.params.id, review).then( function victory(resp){
				DeathMatchService.openMatch(resp.data._id)
				.then( function victory(resp) {
					$timeout(function() {
						$scope.init();
						$scope.hasWrittenReview($scope.userInfo._id, $state.params.id);
					});
				}, function failure(err) {
					console.log(err);
				});
			}), function failure(err){
				console.log(err);
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
		templateUrl: "views/death-match-view.html"
	};
})
