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
		if(content){
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
			gameNum: "="
		},
		templateUrl: "views/death-match-view.html"
	};
})
