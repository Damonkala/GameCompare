'use strict';

angular.module('gameCompare')

.controller('gameCtrl', function($scope, $http, UserService, GameService, $cookies, jwtHelper, $location, ScopeMaster, $state){
	// GameService.load()
	// .then( function victory(resp) {
	// 	console.log("INFO:", resp.data);
	// 	$scope.dbGames = resp.data;
	// }, function failure(err) {
	// 	console.log(err);
	// });

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
		$http.post(`/deathMatches`, deathmatch).then(function victory(resp){
			$state.go('deathMatchPage', {"id": resp.data._id})
		}, function failure(err){
			console.log("OH NO!", err);
		})
	}
	// $scope.compare = function(game1, game2){
	// 	var games = {}
	// 	games.game1 = game1;
	// 	games.game2 = game2;
	// 	GameService.startBattle(games).then(function victory(resp){
	// 		$scope.gameOne = ScopeMaster.setScopes(resp.data[0][0])
	// 		$scope.gameTwo = ScopeMaster.setScopes(resp.data[1][0])
	// 	}, function failure(err){
	// 		console.log(err);
	// 	})
	// }
	if(!$state.params.game1 || !$state.params.game2){
		$state.go('list');
	}
	var games = {};
	games.game1 = $state.params.game1;
	games.game2 = $state.params.game2;
	GameService.getGames(games)
	.then(function(res) {
		$scope.gameOne = ScopeMaster.setScopes(res.data.game1[0])
		$scope.gameTwo = ScopeMaster.setScopes(res.data.game2[0])
	}, function(err) {
		console.log("Something went wrong, whoops");
		console.error(err)
	})
})
.directive("gameDirective", function() {
	return {
		restrict: 'AE',
		scope: {
			gameOne: "=gameOne",
			gameTwo: "=gameTwo",
		},
		templateUrl: "views/game-view.html"
	};
})
