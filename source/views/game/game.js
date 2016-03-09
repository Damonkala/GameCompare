'use strict';

angular.module('gameCompare')

.controller('gameCtrl', function($scope, $http, ENV, UserService, GameService, $cookies, jwtHelper, $location, ScopeMaster, $state){
	var games = {};
	games.game1 = $state.params.game1
	games.game2 = $state.params.game2
	GameService.getGames(games)
	.then(function(res) {;
		$scope.gameOne = ScopeMaster.setScopes(res.data.game1[0])
		$scope.gameTwo = ScopeMaster.setScopes(res.data.game2[0])
	}, function(err) {
		console.log("Something went wrong, whoops");
		console.error(err)
	})
$scope.readGame2 = function(){
	console.log("Is game two okay?", $scope.gameTwo);
}
	var cookies = $cookies.get('token');
	if(cookies){
		$scope.userInfo = (jwtHelper.decodeToken(cookies))
		console.log("I AM ", $scope.userInfo);
	}
	UserService.isAuthed(cookies)
	.then(function(res , err){
		if (res.data === "authRequired"){
		} else
		{$scope.isLoggedIn = true;}
	})
	$scope.comparing = function(score1, score2){
		return GameService.compareGames(score1, score2)
	}
	$scope.startBattle = function(){
		var deathmatch = {};
		deathmatch.user = $scope.userInfo._id;
		deathmatch.game1 = $scope.gameOne;
		deathmatch.game2 = $scope.gameTwo;
		// GameService.startBattle(deathmatch)
		$http.post(`${ENV.API_URL}/deathMatches`, deathmatch).then(function victory(resp){
			console.log("HOORAY", resp);
		}, function failure(err){
			console.log("OH NO!", err);
		})
	}
})
.directive("gameDirective", function() {
	return {
		restrict: 'AE',
		scope: {
			gameOne: "=",
			gameTwo: "=",
		},
		templateUrl: "views/game-view.html"
	};
})
