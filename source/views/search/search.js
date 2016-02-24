'use strict';

angular.module('gameCompare')

.controller('searchCtrl', function($scope, $http, ENV, GameService){
	$scope.loading = false;
	console.log("LOADING?", $scope.loading);
	var loadingPics = ["http://www.contemporary-home-computing.org/idioms/wp-content/uploads/mario.gif", "http://vignette3.wikia.nocookie.net/kirby/images/7/70/Sonic_1_Running.gif/revision/latest?cb=20140909010956&path-prefix=en", "http://rs128.pbsrc.com/albums/p195/R3DG3CKO/pacman.gif~c200", "https://49.media.tumblr.com/e818add8c7f18bf8c6e45d61ec83d89a/tumblr_ms85ibKsgO1rf4po9o1_250.gif"]
	$scope.search = function(term){
		$scope.loading = true;
		$scope.loadingImage = loadingPics[Math.floor(Math.random() * loadingPics.length)];
		console.log("LOADING IMAGE", $scope.loadingImage);
		console.log("LOADING?", $scope.loading);
		term = term.replace(/\s+/g, '-').toLowerCase();
		GameService.searchGame(term).then( function victory(resp) {
			$scope.loading = false;
			console.log("INFO:", resp.data.games);
			$scope.games = resp.data.games;
			console.log(moment($scope.games[0].release_date).format('MMMM Do YYYY, h:mm:ss a'));
		}, function failure(err) {
			console.log(err);
		});
	}
	$scope.openGame = function(id, name){
		$scope.loadingImage = loadingPics[Math.floor(Math.random() * loadingPics.length)];
		console.log("LOADING IMAGE", $scope.loadingImage);
		$scope.loading = true;
		console.log("LOADING?", $scope.loading);
		GameService.openGame(id).then( function victory(resp) {
			console.log("NEW INFO:", resp);
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
			}
			$scope.choices = resp.data.possibleChoices
		}, function failure(err) {
			console.log(err);
		});
	}
	$scope.saveGame = function(){
		var badScore = {'criticScore': 0, 'userScore': 0}
		console.log("Shaving");
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
		console.log("spot", newGame.gamespot);
		console.log("radar", newGame.gamesradar);
		console.log("ign", newGame.ign);
		console.log("meta", newGame.metacritic);
		GameService.saveGame(newGame).then( function victory(resp) {
			console.log(resp.data)
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
		// scope: {
		// 	gameOne: "=",
		// 	gameTwo: "=",
		// },
		templateUrl: "views/search-view.html"
	}
})
