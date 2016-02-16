'use strict';

angular.module('gameCompare')

.controller('gameCtrl', function($scope, $http, ENV, UserService, GameService, $cookies, jwtHelper, $location, ScopeMaster){
	console.log("STARTING GAME ONE SCOPE", $scope.gameOne);
	GameService.load()
	.then( function victory(resp) {
		console.log("INFO:", resp.data);
		$scope.dbGames = resp.data;
	}, function failure(err) {
		console.log(err);
	});
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
		console.log("COMPARISON TOTALED UP!");
		return GameService.compareGames(score1, score2)
	}
	$scope.startBattle = function(){
		console.log($scope.gameOne, " V.S ", $scope.gameTwo);
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
	$scope.compare = function(game1, game2){
		var games = {}
		games.game1 = game1;
		games.game2 = game2;
		GameService.startBattle(games).then(function victory(resp){
			$scope.gameOne = ScopeMaster.setScopes(resp.data[0][0])
			console.log("WHOAH THERE BOY", typeof $scope.gameOne);
			console.log("GAME ONE SCOPE", $scope.gameOne);
			$scope.gameTwo = ScopeMaster.setScopes(resp.data[1][0])
			console.log("GAME TWO SCOPE", $scope.gameTwo);
		}, function failure(err){
			console.log(err);
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
