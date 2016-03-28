'use strict';

angular.module('gameCompare')

.controller('listCtrl', function($scope, $http, $state, GameService, $timeout){
	$scope.loading = false;
	var loadingPics = ["http://www.contemporary-home-computing.org/idioms/wp-content/uploads/mario.gif", "http://vignette3.wikia.nocookie.net/kirby/images/7/70/Sonic_1_Running.gif/revision/latest?cb=20140909010956&path-prefix=en", "http://rs128.pbsrc.com/albums/p195/R3DG3CKO/pacman.gif~c200", "https://49.media.tumblr.com/e818add8c7f18bf8c6e45d61ec83d89a/tumblr_ms85ibKsgO1rf4po9o1_250.gif"]
	$scope.init = function(){
		$http.get(`/games/`).then( function victory(resp) {
			$scope.dbGames = resp.data;
		}, function failure(err) {
			console.log(err);
		});
	}
	$scope.init();
	$scope.upd8 = function(){
		$scope.init();
	}
	$scope.game = {
		dbGames: []
	};
	$scope.checkAll = function() {
		$scope.game.dbGames = angular.copy($scope.dbGames);
	};
	$scope.uncheckAll = function() {
		$scope.game.dbGames = [];
	};
	$scope.compareTwoGames = function() {
		if($scope.game.dbGames.length > 2){
			var randomPair = {};
			randomPair.game1 = $scope.game.dbGames[Math.floor(Math.random()*$scope.game.dbGames.length)];
			randomPair.game2 = $scope.game.dbGames[Math.floor(Math.random()*$scope.game.dbGames.length)];
			if(randomPair.game1.name === randomPair.game2.name){
				$scope.compareTwoGames();
			} else {
				$state.go('game', {"game1": randomPair.game1.name, "game2": randomPair.game2.name})
			}
		} else {
			$state.go('game', {"game1": $scope.game.dbGames[0].name, "game2": $scope.game.dbGames[1].name})
		}
	}
	$scope.search = function(term){
		$scope.loading = true;
		$scope.loadingImage = loadingPics[Math.floor(Math.random() * loadingPics.length)];
		term = term.replace(/\s+/g, '-').toLowerCase();
		GameService.searchGame(term).then( function victory(resp) {
			$scope.loading = false;
			$scope.games = resp.data.games;
		}, function failure(err) {
			console.console.error();(err);
		});
	}
	$scope.openGame = function(id, name){
		$scope.loadingImage = loadingPics[Math.floor(Math.random() * loadingPics.length)];
		$scope.loading = true;
		GameService.openGame(id).then( function victory(resp) {
			$scope.url = `https://www.igdb.com/games/${resp.data.game.slug}`;
			$scope.gameInfo = resp.data.game;
		}, function failure(err) {
			console.log(err);
		});
		$scope.reviews = false;
		GameService.getScore(name)
		.then( function victory(resp) {
			$scope.reviews = false;
			if(!resp.data.message){
				$scope.reviews = true;
				var scoreData = resp.data.result;
				console.log("This just in ", scoreData);
				$scope.gamespot = scoreData.gamespot
				$scope.gamesradar = scoreData.gamesradar
				$scope.ign = scoreData.ign
				$scope.metacritic = scoreData.metacritic
				$scope.loading = false;
			}
			$scope.choices = resp.data.possibleChoices
		}, function failure(err) {
			console.log(err);
		});
	}
	$scope.saveGame = function(){
		var badScore = {'criticScore': 0, 'userScore': 0}
		var newGame = {}
		newGame.companies = $scope.gameInfo.companies
		newGame.url = $scope.url
		newGame.cover = $scope.gameInfo.cover ? $scope.gameInfo.cover : '//res.cloudinary.com/igdb/image/upload/t_thumb/nocover_qhhlj6.jpg';
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
		GameService.saveGame(newGame).then( function victory(resp) {
			swal({
				type: "success",
				title: "Game added to database",
				text: `${newGame.name} has been added`,
				imageUrl: "images/thumbs-up.jpg",
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Great!",
			});
			$timeout(function() {
				$scope.init();
				console.log('update with timeout fired')
			}, 10000);
		}, function failure(err) {
			console.log(err);
		});
	}
})
.filter('cmdate', [
	'$filter', function($filter) {
		return function(input, format) {
			return $filter('date')(new Date(input), format);
		};
	}
])
.directive("searchDirective", function() {
	return {
		restrict: 'AE',
		templateUrl: "views/search-view.html"
	}
})
