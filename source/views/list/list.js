'use strict';

angular.module('gameCompare')

.controller('listCtrl', function($scope, $http, ENV, $state, GameService){
	$scope.loading = false;
	console.log("LOADING?", $scope.loading);
	var loadingPics = ["http://www.contemporary-home-computing.org/idioms/wp-content/uploads/mario.gif", "http://vignette3.wikia.nocookie.net/kirby/images/7/70/Sonic_1_Running.gif/revision/latest?cb=20140909010956&path-prefix=en", "http://rs128.pbsrc.com/albums/p195/R3DG3CKO/pacman.gif~c200", "https://49.media.tumblr.com/e818add8c7f18bf8c6e45d61ec83d89a/tumblr_ms85ibKsgO1rf4po9o1_250.gif"]
	$http.get(`${ENV.API_URL}/games/`).then( function victory(resp) {
		$scope.dbGames = resp.data;
	}, function failure(err) {
		console.log(err);
	});
	$scope.game = {
		names: []
	}
	$scope.checkAll = function(){
		console.log("CHECKING ALŁ");
		$scope.game.names = angular.copy($scope.names);
	}
	$scope.uncheckAll = function() {
		$scope.game.names = [];
	};
	$scope.compareTwoGames = function() {
		if($scope.game.names.length > 2){
			var randomPair = {};
			randomPair.game1 = $scope.game.names[Math.floor(Math.random()*$scope.game.names.length)];
			randomPair.game2 = $scope.game.names[Math.floor(Math.random()*$scope.game.names.length)];
			if(randomPair.game1.name === randomPair.game2.name){
				console.log("A failure occured");
				$scope.compareTwoGames();
			} else {
				console.log("Random Game 1",randomPair.game1.name.replace(/\s+/g, '+').toLowerCase());
				console.log("Random Game 2",randomPair.game2.name.replace(/\s+/g, '+').toLowerCase());
				$state.go('game', {"game1": randomPair.game1.name, "game2": randomPair.game2.name})
			}
		} else {
			$state.go('game', {"game1": $scope.game.names[0].name, "game2": $scope.game.names[1].name})
		}
	}
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
				$scope.loading = false;
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
		GameService.saveGame(newGame).then( function victory(resp) {
			swal({
				type: "success",
				title: "Game added to database",
				text: `${newGame.name} has been added`,
				imageUrl: "images/thumbs-up.jpg"
			});
		}, function failure(err) {
			swal({
				type: "error",
				title: "Sorry, this game is already in the database",
				text: "I promise to get rid of the button, and even the game from the list one day",
				showConfirmButton: true,
				confirmButtonText: "Fine",
			});
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
