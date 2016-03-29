'use strict';

var app = angular.module('gameCompare', ['ui.router', 'angular-jwt', 'ngCookies','naif.base64', 'base64', 'checklist-model'])


// app.constant('ENV', {
//   API_URL: 'https://game-compare.herokuapp.com'
//   API_URL: 'http://localhost:3000'
// });


app.config(function($stateProvider, $urlRouterProvider, $locationProvider){
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state('home', {url: '/',
  templateUrl: 'views/home/home.html',
  controller: 'homeCtrl'})
  .state('search', {url: '/search', templateUrl: 'views/search/search.html', controller: 'searchCtrl'})
  .state('list', {url: '/list', templateUrl: 'views/list/list.html', controller: 'listCtrl'})
  .state('game', {url: '/game/{game1}/{game2}', templateUrl: 'views/game/game.html', controller: 'gameCtrl'})
  .state('login', {url: '/login', templateUrl: 'views/login/login.html', controller: 'loginCtrl'})
  .state('register', {url: '/register', templateUrl: 'views/register/register.html', controller: 'registerCtrl'})
  .state('usersList', {url: '/userslist', templateUrl: 'views/user/usersList/usersList.html', controller: 'usersListCtrl'})
  .state('userPage', {url: '/userpage/{username}', templateUrl: 'views/user/userPage/userPage.html', controller: 'userPageCtrl'})
  .state('deathMatchList', {url: '/deathMatchlist', templateUrl: 'views/deathMatch/deathMatchList/deathMatchList.html', controller: 'deathMatchListCtrl'})
  .state('deathMatchPage', {url: '/deathMatchpage/{id}', templateUrl: 'views/deathMatch/deathMatchPage/deathMatchPage.html', controller: 'deathMatchPageCtrl'})
})

app.controller('MasterController', function(UserService, $cookies, jwtHelper, $scope, $state, $rootScope){
  var cookies = $cookies.get('token');
  var username;
  if(cookies){
    $scope.userInfo = (jwtHelper.decodeToken(cookies))
  }
  UserService.isAuthed(cookies)
  .then(function(res , err){
    if (res.data !== "authRequired"){
      // $state.go('usersList');
      $scope.isLoggedIn = true;
    } else {
      $scope.isLoggedIn = false;
      // $state.go('game');
    }
  })
  $scope.$on('loggedIn', function(){
    $scope.isLoggedIn = true;
    var cookies = $cookies.get('token');
    if(cookies){
      $scope.userInfo = (jwtHelper.decodeToken(cookies))
    }
    username = $scope.userInfo.username

  })
  $scope.$on('edit', function(event, data){
    if(!$scope.userInfo.isAdmin || data._id === $scope.userInfo._id){
      $scope.userInfo = data;
      username = $scope.userInfo.username
    }
  })
  $scope.logout = function(){
    $scope.isLoggedIn = false;
    $cookies.remove('token');
    $state.go('game')
  }
  $scope.goHome = function(){
    var username = $scope.userInfo.username
    $state.go('userPage', {"username": username})
  }
})

'use strict';

var app = angular.module('gameCompare');

app.service('DeathMatchService', function($http, $location, $rootScope, $cookies, jwtHelper){
	this.load = function(){
		return $http.get(`/deathMatches/`)
	};
	this.openMatch = function(id){
		return $http.get(`/deathMatches/${id}`)
	};

})

'use strict';

angular.module('gameCompare')

.controller('gameCtrl', function($scope, $http, UserService, GameService, $cookies, jwtHelper, $location, ScopeMaster, $state){
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
		console.log($scope.gameOne, $scope.gameTwo);
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

'use strict';

var app = angular.module('gameCompare');

app.service('GameService', function($http, $location, $rootScope, $cookies, jwtHelper){
	this.load = function(){
		return $http.get(`/games/`)
	};
	this.openGame = function(id){
		return $http.get(`/games/page/stats/${id}`)
	};
	this.searchGame = function(term){
		return $http.get(`/games/search/${term}`)
	};
	this.startBattle = function(deathmatch){
		return $http.post(`/deathMatches`, deathmatch)
	};
	this.startBattle = function(games){
		return $http.post(`/games/compare`, games)
	};
	this.getScore = function(name){
		return $http.get(`/games/page/scores/${name}`)
	};
	this.saveGame = function(newGame){
		return $http.post(`/games`, newGame)
	};
	this.getGames = function(games){
		return $http.post(`/games/getTwoGames`, games)
	}
	this.compareGames = function(score1, score2){
		if(Number(score1) > Number(score2) || isNaN(Number(score2)) ){
			return "isGreaterThan"
		} if(Number(score1) < Number(score2) || isNaN(Number(score1))) {
			return "isLessThan"
		} else {
			return "isEqualTo"
		}
	}
	// this.totalScore = function()
})

'use strict';

angular.module('gameCompare')

.controller('homeCtrl', function($scope, $http){
	$http.get(`/games/`).then( function victory(resp) {
		$scope.dbGames = resp.data;
	}, function failure(err) {
		console.log(err);
	});

	$scope.compare = function(){
	}

})

'use strict';

var app = angular.module('gameCompare');

app.service('ScopeMaster', function($http, $location, $rootScope, $cookies, jwtHelper){
	this.setScopes = function(data){
		var trueGame = data;
		var noReview = {criticScore: 0, userScore: 0, url:null}
		trueGame.cover = data.cover ? data.cover[0].url : '//res.cloudinary.com/igdb/image/upload/t_thumb/nocover_qhhlj6.jpg';

		trueGame.gameSpotCriticScore = data.gamespot.length ? data.gamespot[0].criticScore : 0
		trueGame.gameSpotUserScore = data.gamespot.length ? data.gamespot[0].userScore : 0
		trueGame.gameSpotUrl = data.gamespot.length ? data.gamespot[0].url : undefined

		trueGame.gamesRadarCriticScore = data.gamesradar.length ? data.gamesradar[0].criticScore : 0
		trueGame.gamesRadarUserScore = data.gamesradar.length ? data.gamesradar[0].userScore : 0
		trueGame.gamesRadarUrl = data.gamesradar.length ? data.gamesradar[0].url : undefined

		trueGame.metacriticCriticScore = data.metacritic.length ? data.metacritic[0].criticScore : 0
		trueGame.metacriticUserScore = data.metacritic.length ? data.metacritic[0].userScore : 0
		trueGame.metacriticUrl = data.metacritic.length ? data.metacritic[0].url : undefined

		trueGame.ignCriticScore = data.ign.length ? data.ign[0].criticScore : 0
		trueGame.ignUserScore = data.ign.length ? data.ign[0].userScore : 0
		trueGame.ignUrl = data.ign.length ? data.ign[0].url : undefined
		// if(data.gamespot){
		// 	trueGame.gameSpot = data.gamespot[0];
		// } else{
		// 	trueGame.gameSpot = noReview;
		// }
		// if(data.gamesradar){
		// 	trueGame.gamesRadar = data.gamesradar[0];
		// } else{
		// 	trueGame.gamesRadar = noReview;
		// }
		// trueGame.gamesRadarCriticScore = data.gamesradar[0].criticScore;
		// trueGame.gamesRadarUserScore = data.gamesradar[0].userScore;
		// trueGame.gamesRadarUrl = data.gamesradar[0].url;
		//
		// trueGame.ignCriticScore = data.ign[0].criticScore;
		// trueGame.ignUserScore = data.ign[0].userScore;
		// trueGame.ignUrl = data.ign[0].url;
		//
		// trueGame.metacriticCriticScore = data.metacritic[0].criticScore;
		// trueGame.metacriticUserScore = data.metacritic[0].userScore;
		// trueGame.metacriticUrl = data.metacritic[0].url;

		var criticScore = [trueGame.gameSpotCriticScore, trueGame.gamesRadarCriticScore, trueGame.ignCriticScore, trueGame.metacriticCriticScore]
		var userScore = [trueGame.gameSpotUserScore, trueGame.gamesRadarUserScore, trueGame.ignUserScore, trueGame.metacriticUserScore]

		function totalScore(scores) {
			var total = [];
			
			for(var i = 0; i<scores.length;i++){
				if(!Number(scores[i])){
					total.push(0)
				} else {
					total.push(Number(scores[i]))
				}
			}
			return total.reduce(function(a, b){
				// var nonWholeNumber = a + b;
				// return Math.max( Math.round(nonWholeNumber * 10) / 10).toFixed(2);
				return a + b;

			})
		}
		// trueGame.totalCritic = totalScore([trueGame.gameSpotCriticScore, trueGame.gamesRadarCriticScore, trueGame.ignCriticScore, trueGame.metacriticCriticScore])
		trueGame.totalCritic = totalScore(criticScore)
		trueGame.totalUser = totalScore(userScore)
		// trueGame.totalUser = totalScore([trueGame.gameSpotUserScore, trueGame.gamesRadarUserScore, trueGame.ignUserScore, trueGame.metacriticUserScore])

		return trueGame
	}
})

'use strict';

angular.module('gameCompare')

.controller('listCtrl', function($scope, $http, $state, GameService, $timeout){
	$scope.loading = false;
	var loadingPics = ["http://www.contemporary-home-computing.org/idioms/wp-content/uploads/mario.gif", "http://vignette3.wikia.nocookie.net/kirby/images/7/70/Sonic_1_Running.gif/revision/latest?cb=20140909010956&path-prefix=en", "http://rs128.pbsrc.com/albums/p195/R3DG3CKO/pacman.gif~c200", "https://49.media.tumblr.com/e818add8c7f18bf8c6e45d61ec83d89a/tumblr_ms85ibKsgO1rf4po9o1_250.gif"]
	$scope.init = function(){
		$http.get(`/games/`).then( function victory(resp) {
			$scope.dbGames = resp.data;
			console.log("Current games in the list", $scope.dbGames);
		}, function failure(err) {
			console.log(err);
		});
	}
	$scope.init();
	$scope.upd8 = function(){
		$http.get(`/games/`).then( function victory(resp) {
			$scope.dbGames = resp.data;
			console.log("Upd8ted list", $scope.dbGames);
		}, function failure(err) {
			console.log(err);
		});
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
			}, 3000);
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

'use strict';

var app = angular.module('gameCompare');

app.service('UserReviewService', function($http, $location, $rootScope, $cookies, jwtHelper){
	this.writeReview = function(id, review){
		return $http.put(`/deathMatches/${id}`, review)
	};
	this.upvote = function(userId, deathMatch, review, criticId){
		return $http.put(`/userReviews/upvote`, {"userInfo": userId, "deathMatch": deathMatch, "review": review, "criticId": criticId})
	}
	this.downvote = function(userId, deathMatch, review, criticId){
		return $http.put(`/userReviews/downvote`, {"userInfo": userId, "deathMatch": deathMatch, "review": review, "criticId": criticId})
	}
	this.wroteReview = function(userInfoId, deathMatchId){
		console.log("Made it to service!");
		return $http.post(`/userReviews/wroteReview`, {userInfo: userInfoId, deathMatch: deathMatchId})
	};
	this.hasVoted = function(userId, reviewId){
		return $http.post('/userReviews/hasVoted', {userId: userId, reviewId: reviewId})
	}
})

'use strict';

angular.module('gameCompare')
.controller('loginCtrl', function($scope, $state, $rootScope, UserService, jwtHelper, $cookies){
	$scope.submit = function(user){
		UserService.login(user)
		.then(function(res){
			$scope.$emit('loggedIn');
			if(res.data === "Incorrect Username or Password!"){
				swal({
					type: "error",
					title: "Uh-Oh!",
					text: res.data,
					showConfirmButton: true,
					confirmButtonText: "I hear ya.",
				});
			} else{
				document.cookie = 'token' + "=" + res.data;
				var token = $cookies.get('token');
				var decoded = jwtHelper.decodeToken(token);
				UserService.loggedIn = 'true';
				$state.go('userPage', {"username": user.username})
			}
		}, function(err) {
			console.error(err);
		});
	}
});

'use strict';

var app = angular.module('gameCompare');

app.service('UserService', function($http, $location, $rootScope, $cookies, jwtHelper){
	this.login = function(user){
		return $http.post(`/user/login`, user);
	};
	this.register = function(user){
		return $http.post(`/user/register`, user);
	};
	this.list = function(){
		return $http.get(`/user/list`);
	};
	this.page = function(username){
		return $http.get(`/user/page/${username}`)
	}
	this.favoriteUser = function(userId){
		var data = {};
		var decoded = (jwtHelper.decodeToken($cookies.get('token')))
		data.myId = decoded._id;
		data.favoriteId = userId
		return $http.put(`/user/favorite`, data)
	};
	this.editAccount = function(data){
		return $http.post(`/user/edit`, data)
	}
	this.unFavoriteUser = function(userId){
		var data = {};
		var decoded = (jwtHelper.decodeToken($cookies.get('token')))
		data.myId = decoded._id;
		data.unFavoriteId = userId
		return $http.put(`/user/unfavorite`, data)
	}
	this.eraseUser = function(userId){
		var data = {};
		data.userId = userId
		return $http.post(`/user/erase`, data)
	}
	this.loggedIn = function(isLoggedIn){
		if(isLoggedIn){
			$scope.$emit('loggedIn');
			return true
		}
	};
	this.uploadImage = function(image, userId){
		return $http.post(`/imageUpload`, {
			userId: userId,
			image: image
		})
	}
	this.isAuthed = function(token){
		return $http.post(`/auth`, {token:token})
	};
	this.wroteReview = function(userInfoId, deathMatchId){
		return $http.post(`/deathMatches/wroteReview`, {userInfo: userInfoId, deathMatch: deathMatchId})
	};
	this.hasVoted = function(userId, reviewId){
		return $http.post('/deathMatches/hasVoted', {userId: userId, reviewId: reviewId})
	}
})

'use strict';

angular.module('gameCompare')


.controller('registerCtrl', function($scope, $state, UserService){
	$scope.submit = function(user){
		if(user.password !== user.password2){
			swal({
				type: "warning",
				title: "Passwords don't match!",
				text: "Matching passwords only please",
				showConfirmButton: true,
				confirmButtonText: "Gotcha.",
			});
			return;
		}
		if(!user.email){
			swal({
				type: "error",
				title: "Give us your email address!",
				text: "C'mon, we know that's a fake!",
				showConfirmButton: true,
				confirmButtonText: "I hear ya.",
			});
			return;
		}
		UserService.register(user)

		.then(function(data){
			swal({
				type: "success",
				title: "Successful registration!",
				text: "Hurray. You're a User!",
				imageUrl: "images/thumbs-up.jpg"
			});			$state.go('login');
		}, function(err){
			console.log(err);
		});
	}
});

// 'use strict';
//
// angular.module('gameCompare')
//
// .controller('searchCtrl', function($scope, $http, ENV, GameService){
// 	$scope.loading = false;
// 	console.log("LOADING?", $scope.loading);
// 	var loadingPics = ["http://www.contemporary-home-computing.org/idioms/wp-content/uploads/mario.gif", "http://vignette3.wikia.nocookie.net/kirby/images/7/70/Sonic_1_Running.gif/revision/latest?cb=20140909010956&path-prefix=en", "http://rs128.pbsrc.com/albums/p195/R3DG3CKO/pacman.gif~c200", "https://49.media.tumblr.com/e818add8c7f18bf8c6e45d61ec83d89a/tumblr_ms85ibKsgO1rf4po9o1_250.gif"]
// 	$scope.search = function(term){
// 		$scope.loading = true;
// 		$scope.loadingImage = loadingPics[Math.floor(Math.random() * loadingPics.length)];
// 		console.log("LOADING IMAGE", $scope.loadingImage);
// 		console.log("LOADING?", $scope.loading);
// 		term = term.replace(/\s+/g, '-').toLowerCase();
// 		GameService.searchGame(term).then( function victory(resp) {
// 			$scope.loading = false;
// 			console.log("INFO:", resp.data.games);
// 			$scope.games = resp.data.games;
// 			console.log(moment($scope.games[0].release_date).format('MMMM Do YYYY, h:mm:ss a'));
// 		}, function failure(err) {
// 			console.log(err);
// 		});
// 	}
// 	$scope.openGame = function(id, name){
// 		$scope.loadingImage = loadingPics[Math.floor(Math.random() * loadingPics.length)];
// 		console.log("LOADING IMAGE", $scope.loadingImage);
// 		$scope.loading = true;
// 		console.log("LOADING?", $scope.loading);
// 		GameService.openGame(id).then( function victory(resp) {
// 			console.log("NEW INFO:", resp);
// 			$scope.loading = false;
// 			$scope.url = `https://www.igdb.com/games/${resp.data.game.slug}`;
// 			$scope.gameInfo = resp.data.game;
// 		}, function failure(err) {
// 			console.log(err);
// 		});
// 		$scope.reviews = false;
// 		GameService.getScore(name)
// 		.then( function victory(resp) {
// 			// $scope.reviews = false;
// 			$scope.reviews = true;
// 			if(!resp.data.message){
// 				var scoreData = resp.data.result;
// 				console.log("This just in ", scoreData);
// 				$scope.gamespot = scoreData.gamespot
// 				$scope.gamesradar = scoreData.gamesradar
// 				$scope.ign = scoreData.ign
// 				$scope.metacritic = scoreData.metacritic
// 				// $scope.loading = false;
// 			}
// 			$scope.choices = resp.data.possibleChoices
// 		}, function failure(err) {
// 			console.log(err);
// 		});
// 	}
// 	$scope.saveGame = function(){
// 		var badScore = {'criticScore': 0, 'userScore': 0}
// 		console.log("Shaving");
// 		var newGame = {}
// 		newGame.companies = $scope.gameInfo.companies
// 		newGame.url = $scope.url
// 		newGame.cover = $scope.gameInfo.cover ? $scope.gameInfo.cover : '//res.cloudinary.com/igdb/image/upload/t_thumb/nocover_qhhlj6.jpg';
// 		newGame.genres = $scope.gameInfo.genres
// 		newGame.id = $scope.gameInfo.id
// 		newGame.name = $scope.gameInfo.name
// 		newGame.releases = $scope.gameInfo.release_dates
// 		newGame.summary = $scope.gameInfo.summary
// 		newGame.themes = $scope.gameInfo.themes
//
// 		newGame.gamespot = $scope.gamespot
// 		newGame.gamesradar = $scope.gamesradar
// 		newGame.ign = $scope.ign
// 		newGame.metacritic = $scope.metacritic
// 		console.log("spot", newGame.gamespot);
// 		console.log("radar", newGame.gamesradar);
// 		console.log("ign", newGame.ign);
// 		console.log("meta", newGame.metacritic);
// 		GameService.saveGame(newGame).then( function victory(resp) {
// 			console.log(resp.data)
// 		}, function failure(err) {
// 			console.log(err);
// 		});
// 	}
// })
// .filter('cmdate', [
// 	'$filter', function($filter) {
// 		return function(input, format) {
// 			return $filter('date')(new Date(input), format);
// 		};
// 	}
// ])
// // .directive("searchDirective", function() {
// // 	return {
// // 		restrict: 'AE',
// // 		// scope: {
// // 		// 	gameOne: "=",
// // 		// 	gameTwo: "=",
// // 		// },
// // 		templateUrl: "views/search-view.html"
// // 	}
// // })

'use strict';

angular.module('gameCompare')


.controller('deathMatchListCtrl', function($scope, $location, $rootScope, $state, $cookies, $http, DeathMatchService, GameService){
	DeathMatchService.load()
	.then( function victory(resp) {
		deathMatches = resp.data;
		$scope.deathMatches = resp.data;
	}, function failure(err) {
		console.log(err);
	});
	var deathMatches;
	$scope.comparing = function(score1, score2){
		return GameService.compareGames(score1, score2)
	}
	$scope.$watch(function(){return $scope.searchTerm}, function(n,o){
		$scope.updateSearch();
	})
	$scope.updateSearch = function(searchTerm){
		if(searchTerm){
		$scope.deathMatches = $scope.deathMatches.filter(function(deathMatch){
			if (deathMatch.game1.name.toLowerCase().match(searchTerm.toLowerCase()) || deathMatch.game2.name.toLowerCase().match(searchTerm.toLowerCase()) || deathMatch.user.name.toLowerCase().match(searchTerm.toLowerCase())){
				return true
			} else{
				return false
			}
		})
		} else{
			$scope.deathMatches = deathMatches
		}
	}
})

'use strict';

angular.module('gameCompare')


.controller('deathMatchPageCtrl', function($scope, $state, UserService, $cookies, jwtHelper, $location , $base64, $http, DeathMatchService, GameService, ScopeMaster, UserReviewService){
	var cookies = $cookies.get('token');
	if(cookies){
		$scope.userInfo = (jwtHelper.decodeToken(cookies))
	}
	UserService.isAuthed(cookies)
	.then(function(res , err){
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

	$scope.upvote = function(gameId, criticId, reviewScore){
		UserReviewService.upvote($scope.userInfo._id, $scope.deathMatchId, gameId, criticId)
		.then($state.go($state.current, {}, {reload: true}))
	}
	$scope.downvote = function(gameId, criticId){
		UserReviewService.downvote($scope.userInfo._id, $scope.deathMatchId, gameId, criticId)
		.then($state.go($state.current, {}, {reload: true}))
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
					$scope.gameOne = ScopeMaster.setScopes(resp.data.game1)
					$scope.gameTwo = ScopeMaster.setScopes(resp.data.game2)
					$scope.game1UserReviews = resp.data.game1UserReviews
					$scope.game2UserReviews = resp.data.game2UserReviews
					$state.go($state.current, {}, {reload: true});
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

'use strict';

angular.module('gameCompare')


.controller('userPageCtrl', function($scope, $state, UserService, $cookies, jwtHelper, $location , $base64){
	$scope.user = {};
	$scope.editPayload = {};
	var cookies = $cookies.get('token');
	if(cookies){
		var token = jwtHelper.decodeToken(cookies)
		$scope.userInfo = (jwtHelper.decodeToken(cookies))
	}
	UserService.isAuthed(cookies)
	.then(function(res, err){
		if (res.data === "authRequired"){
			// $location.path('/login')
		} else{
			$scope.isLoggedIn = true;
		}
	})
	UserService.page($state.params.username)
	.then(function(res) {
		$scope.user = res.data;
		$scope.favorites = res.data.favorites;
		if(token){
			$scope.isOwnPage = $scope.user.username === token.username || token.isAdmin === true;
			$scope.isEditing = false;
			$scope.editPayload.username = $scope.user.username;
			$scope.editPayload.email = $scope.user.email;

			$scope.editPayload.phone = $scope.user.phone;
			$scope.editPayload.name = $scope.user.name
			$scope.editPayload.address = $scope.user.address
			$scope.editPayload._id = $scope.user._id
			$scope.editPayload.isAdmin = token.isAdmin
		}
		if(res.data.avatar){
			$scope.profileImageSrc = `data:image/jpeg;base64,${$scope.user.avatar}`;
		} else {
			$scope.profileImageSrc = `http://gitrnl.networktables.com/resources/userfiles/nopicture.jpg`
		}

	}, function(err) {
		console.error(err)
	});
	$scope.test = function(){
	}
	$scope.removeFavorite = function (userId){
		UserService.unFavoriteUser(userId)
		.then(function(res){
			$scope.userInfo = res.data
			var cookie = $cookies.get('token');
			var token = jwtHelper.decodeToken(cookie);
			$scope.favorites = $scope.userInfo.favorites;
		})
	}

	$scope.toggleEdit = function(){
		$scope.isEditing = !$scope.isEditing
	}

	$scope.saveEdits = function(){
		if(!$scope.editPayload.phone){$scope.editPayload.phone = 0};
		if(!$scope.editPayload.address){$scope.editPayload.address = ""};
		UserService.editAccount($scope.editPayload)

		.then(function(response){
			$scope.$emit('edit', response.data)
			$scope.user = response.data;
			$scope.isEditing = !$scope.isEditing;
		})

	}

	$scope.uploadImage = function(image){
		UserService.uploadImage(image, $scope.user._id)
		.then(function(res){
			$scope.profileImageSrc = `data:image/jpeg;base64,${res.data.avatar}`;

		})
	}

	$scope.getToMatch = function(id){
		$state.go('deathMatchPage', {"id": id})
	}


	$scope.exposeData = function(){console.log($scope.myFile)}
	UserService.isAuthed(cookies)
	.then(function(res , err){
		if (res.data === "authRequired"){
			// $location.path('/login')
		}
		else{
			$scope.isLoggedIn = true;
		}
	})

});

'use strict';

angular.module('gameCompare')


.controller('usersListCtrl', function($scope, $location, $rootScope, $state, $cookies, UserService, jwtHelper){
	var cookies = $cookies.get('token');
	if(cookies){
		$scope.userInfo = (jwtHelper.decodeToken(cookies))
	}
	UserService.list()
	.then(function(res) {
		users = res.data;
		$scope.users = users;
	}, function(err) {
		console.error(err)
	});
	var users;

	$scope.$watch(function(){return $scope.searchTerm}, function(n,o){
		$scope.updateSearch();
	})

	$scope.addFavorite = function (userId){
		UserService.favoriteUser(userId)
		.then(function(res){
			$scope.userInfo = (jwtHelper.decodeToken(res.data))
		})
	}
	$scope.removeFavorite = function (userId){
		UserService.unFavoriteUser(userId)
		.then(function(res){
			$scope.userInfo = (jwtHelper.decodeToken(res.data))
		})
	}
	$scope.eraseUser = function (userId){
		UserService.eraseUser(userId)
		.then(function(res){
			$scope.users = res.data
			users = res.data
		})
	}

	$scope.favorited = function(user){
		if (user._id !== $scope.userInfo._id){
			return ($scope.userInfo.favorites).some(function(favorite){
				return (user._id === favorite)
			})
		} else {return true}
	}
	$scope.isUser = function(user){
		if (user._id !== $scope.userInfo._id){
				return (false)
		} else {return true}
	}
		// $scope.isAdmin = $scope.userInfo.isAdmin;

	$scope.updateSearch = function(searchTerm){
		// $scope.searchTerm = searchTerm
		if(searchTerm){
		$scope.users = $scope.users.filter(function(user){
			if (user.username.match(searchTerm)){
				return true
			} else{
				return false
			}
		})
		} else{
			$scope.users = users
		}
	}
})
