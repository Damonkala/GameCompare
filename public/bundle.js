'use strict';

var app = angular.module('gameCompare', ['ui.router', 'angular-jwt', 'ngCookies','naif.base64', 'base64'])


app.constant('ENV', {
  // API_URL: 'https://game-compare.herokuapp.com'
  API_URL: 'http://localhost:3000'
});


app.config(function($stateProvider, $urlRouterProvider, $locationProvider){
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state('home', {url: '/', templateUrl: 'views/home/home.html', controller: 'homeCtrl'})
  .state('search', {url: '/search', templateUrl: 'views/search/search.html', controller: 'searchCtrl'})
  .state('list', {url: '/list', templateUrl: 'views/list/list.html', controller: 'listCtrl'})
  .state('game', {url: '/game', templateUrl: 'views/game/game.html', controller: 'gameCtrl'})
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
    console.log("TASTY COOKIES", cookies);
  }
  UserService.isAuthed(cookies)
  .then(function(res , err){
    console.log(res.data)
    if (res.data !== "authRequired"){
      // $state.go('usersList');
      $scope.isLoggedIn = true;
      console.log("LOGGED IN!")
    } else {
      $scope.isLoggedIn = false;
      console.log("YOU AIN'T LOOGED IN SUCKA");
      // $state.go('game');
    }
  })
  $scope.$on('loggedIn', function(){
    console.log("WE GOT LOOOOOOGED IN!!!!!!!!!");
    $scope.isLoggedIn = true;
    var cookies = $cookies.get('token');
    if(cookies){
      console.log("in cookis if")
      $scope.userInfo = (jwtHelper.decodeToken(cookies))
    }
    username = $scope.userInfo.username

  })
  $scope.$on('edit', function(event, data){
    console.log('e:', event);
    console.log('d:', data);
    console.log("New:", data._id)
    console.log("Old", $scope.userInfo._id)
    if(!$scope.userInfo.isAdmin || data._id === $scope.userInfo._id){
      $scope.userInfo = data;
      username = $scope.userInfo.username
      console.log("NEWUSERNAME!!!!!", username)
    }
  })
  $scope.logout = function(){
    $scope.isLoggedIn = false;
    $cookies.remove('token');
    $state.go('game')
  }
  $scope.goHome = function(){
    var username = $scope.userInfo.username
    console.log("ISUSERNAME", username)
    $state.go('userPage', {"username": username})
  }
})

'use strict';

var app = angular.module('gameCompare');

app.service('DeathMatchService', function($http, ENV, $location, $rootScope, $cookies, jwtHelper){
	this.load = function(){
		return $http.get(`${ENV.API_URL}/deathMatches/`)
	};
	this.openMatch = function(id){
		return $http.get(`${ENV.API_URL}/deathMatches/${id}`)
	};
	this.writeReview = function(id, review){
		return $http.put(`${ENV.API_URL}/deathMatches/${id}`, review)
	};
})

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

'use strict';

var app = angular.module('gameCompare');

app.service('GameService', function($http, ENV, $location, $rootScope, $cookies, jwtHelper){
	this.load = function(){
		return $http.get(`${ENV.API_URL}/games/`)
	};
	this.openGame = function(id){
		return $http.get(`${ENV.API_URL}/games/page/stats/${id}`)
	};
	this.searchGame = function(term){
		return $http.get(`${ENV.API_URL}/games/search/${term}`)
	};
	this.startBattle = function(deathmatch){
		return $http.post(`${ENV.API_URL}/deathMatches`, deathmatch)
	};
	this.startBattle = function(games){
		return $http.post(`${ENV.API_URL}/games/compare`, games)
	};
	this.getScore = function(name){
		return $http.get(`${ENV.API_URL}/games/page/scores/${name}`)
	};
	this.saveGame = function(newGame){
		return $http.post(`${ENV.API_URL}/games`, newGame)
	};
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

.controller('homeCtrl', function($scope, $http, ENV){
	$http.get(`${ENV.API_URL}/games/`).then( function victory(resp) {
		console.log("INFO:", resp.data);
		$scope.dbGames = resp.data;
	}, function failure(err) {
		console.log(err);
	});

	$scope.compare = function(){
		console.log("CLICKITY CLACK");
		console.log("A THANG!", $scope.check);
	}

})

'use strict';

var app = angular.module('gameCompare');

app.service('ScopeMaster', function($http, ENV, $location, $rootScope, $cookies, jwtHelper){
	this.setScopes = function(data){
		var trueGame = data;
		console.log("WHY HAVEN'T I LOGGED THIS YET!?", data);
		var noReview = {criticScore: 0, userScore: 0, url:null}
		trueGame.cover = data.cover ? data.cover[0].url : '//res.cloudinary.com/igdb/image/upload/t_thumb/nocover_qhhlj6.jpg';

		console.log("DO WE HAVE GAMESPOT!?", data.gamespot);
		trueGame.gameSpotCriticScore = data.gamespot.length ? data.gamespot[0].criticScore : 0
		trueGame.gameSpotUserScore = data.gamespot.length ? data.gamespot[0].userScore : 0
		trueGame.gameSpotUrl = data.gamespot.length ? data.gamespot[0].url : undefined

		console.log("DO WE HAVE GAMESRADAR!?", data.gamesradar);
		trueGame.gamesRadarCriticScore = data.gamesradar.length ? data.gamesradar[0].criticScore : 0
		trueGame.gamesRadarUserScore = data.gamesradar.length ? data.gamesradar[0].userScore : 0
		trueGame.gamesRadarUrl = data.gamesradar.length ? data.gamesradar[0].url : undefined

		console.log("DO WE HAVE METACRITIC!?", data.metacritic);

		trueGame.metacriticCriticScore = data.metacritic.length ? data.metacritic[0].criticScore : 0
		trueGame.metacriticUserScore = data.metacritic.length ? data.metacritic[0].userScore : 0
		trueGame.metacriticUrl = data.metacritic.length ? data.metacritic[0].url : undefined

		console.log("DO WE HAVE IGN!?", data.ign);
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
			console.log("DO WE REALLY HAVE SCORE!?", scores);
			for(var i = 0; i<scores.length;i++){
				if(!Number(scores[i])){
					console.log("Not a real score", Number(scores[i]), scores[i]);
					total.push(0)
					console.log("Current total: fail:", total);
				} else {
					console.log("Is a real score", Number(scores[i]), scores[i]);
					total.push(Number(scores[i]))
					console.log("Current total: success:", total);
				}
			}
			return total.reduce(function(a, b){
				console.log("We totaled up, what's the problem?", a + b);
				return a + b;
			})
		}
		// trueGame.totalCritic = totalScore([trueGame.gameSpotCriticScore, trueGame.gamesRadarCriticScore, trueGame.ignCriticScore, trueGame.metacriticCriticScore])
		trueGame.totalCritic = totalScore(criticScore)
		trueGame.totalUser = totalScore(userScore)
		// trueGame.totalUser = totalScore([trueGame.gameSpotUserScore, trueGame.gamesRadarUserScore, trueGame.ignUserScore, trueGame.metacriticUserScore])

		console.log("DO WE HAVE CRITIC SCORE?", criticScore);
		console.log("DO WE HAVE A REAL CRITIC SCORE?", trueGame.totalCritic);
		console.log("DO WE HAVE A REAL USER SCORE?", trueGame.totalUser);
		console.log("TRUE FORM!", trueGame);
		return trueGame
	}
})

'use strict';

angular.module('gameCompare')

.controller('listCtrl', function($scope, $http, ENV){
	$http.get(`${ENV.API_URL}/games/`).then( function victory(resp) {
		console.log("INFO:", resp.data);
		$scope.dbGames = resp.data;
	}, function failure(err) {
		console.log(err);
	});
	$scope.compareTwoGames = function() {
		console.log("Hello");
	}
})

'use strict';

var app = angular.module('gameCompare');

app.service('UserService', function($http, ENV, $location, $rootScope, $cookies, jwtHelper){
	this.login = function(user){
		return $http.post(`${ENV.API_URL}/user/login`, user);
	};
	this.register = function(user){
		return $http.post(`${ENV.API_URL}/user/register`, user);
	};
	this.list = function(){
		return $http.get(`${ENV.API_URL}/user/list`);
	};
	this.page = function(username){
		return $http.get(`${ENV.API_URL}/user/page/${username}`)
	}
	this.favoriteUser = function(userId){
		var data = {};
		var decoded = (jwtHelper.decodeToken($cookies.get('token')))
		data.myId = decoded._id;
		data.favoriteId = userId
		return $http.put(`${ENV.API_URL}/user/favorite`, data)
	};
	this.editAccount = function(data){
		return $http.post(`${ENV.API_URL}/user/edit`, data)
	}
	this.unFavoriteUser = function(userId){
		console.log(userId)
		var data = {};
		var decoded = (jwtHelper.decodeToken($cookies.get('token')))
		data.myId = decoded._id;
		data.unFavoriteId = userId
		console.log("MYID", data.myId)
		console.log("THEIRID", data.unFavoriteId)
		return $http.put(`${ENV.API_URL}/user/unfavorite`, data)
	}
	this.eraseUser = function(userId){
		console.log("USERID", userId)
		var data = {};
		data.userId = userId
		return $http.post(`${ENV.API_URL}/user/erase`, data)
	}
	this.loggedIn = function(isLoggedIn){
		if(isLoggedIn){
			$scope.$emit('loggedIn');
			return true
		}
	};
	this.uploadImage = function(image, userId){
		return $http.post(`${ENV.API_URL}/imageUpload`, {
			userId: userId,
			image: image
		})
	}
	this.isAuthed = function(token){
		return $http.post(`${ENV.API_URL}/auth`, {token:token})
	};
})

'use strict';

angular.module('gameCompare')
.controller('loginCtrl', function($scope, $state, $rootScope, UserService, jwtHelper, $cookies){
	$scope.submit = function(user){
		UserService.login(user)
		.then(function(res){
			console.log('res', res.data)
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
				console.log("This Here is a Token:", token);
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

angular.module('gameCompare')


.controller('registerCtrl', function($scope, $state, UserService){
	console.log("LODADED");
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

'use strict';

angular.module('gameCompare')


.controller('deathMatchListCtrl', function($scope, $location, $rootScope, $state, $cookies, $http, ENV, DeathMatchService, GameService){
	DeathMatchService.load()
	.then( function victory(resp) {
		console.log("INFO:", resp.data);
		$scope.deathMatches = resp.data;
	}, function failure(err) {
		console.log(err);
	});
	$scope.comparing = function(score1, score2){
		return GameService.compareGames(score1, score2)
	}
})

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
	console.log("COOKIES", cookies)
	UserService.isAuthed(cookies)
	.then(function(res, err){
		console.log(res.data)
		if (res.data === "authRequired"){
			$location.path('/login')
		} else{$scope.isLoggedIn = true;}
	})
	UserService.page($state.params.username)
	.then(function(res) {
		console.log("PARAMS", $state.params.name)
		console.log(res.data.favorites)
		$scope.user = res.data;
		$scope.favorites = res.data.favorites;
		$scope.isOwnPage = $scope.user.username === token.username || token.isAdmin === true;
		$scope.isEditing = false;
		$scope.editPayload.username = $scope.user.username;
		$scope.editPayload.email = $scope.user.email;

		$scope.editPayload.phone = $scope.user.phone;
		$scope.editPayload.name = $scope.user.name
		$scope.editPayload.address = $scope.user.address
		$scope.editPayload._id = $scope.user._id
		$scope.editPayload.isAdmin = token.isAdmin

		if ($scope.user.phone ==0){
			console.log("number is zero")
			$scope.hasNoPhoneNumber = true;
			console.log($scope.hasNoPhoneNumber)
		}

		console.log($scope.isEditing)
		console.log("edit Payload", $scope.editPayload)
		console.log('token:',token);
		console.log('scope user username: ', $scope.user.username);
		if(res.data.avatar){
			$scope.profileImageSrc = `data:image/jpeg;base64,${res.data.avatar}`
		} else {
			$scope.profileImageSrc = `http://gitrnl.networktables.com/resources/userfiles/nopicture.jpg`
		}

	}, function(err) {
		console.error(err)
	});
	$scope.test = function(){
		console.log("TESTING")
	}
	$scope.removeFavorite = function (userId){
		UserService.unFavoriteUser(userId)
		.then(function(res){
			console.log(res.data)
			$scope.userInfo = res.data
			var cookie = $cookies.get('token');
			var token = jwtHelper.decodeToken(cookie);
			console.log("TOKEN: ",token)
			console.log("INFO: ",$scope.userInfo)
			$scope.favorites = $scope.userInfo.favorites;
		})
	}

	$scope.toggleEdit = function(){
		console.log($scope.isEditing)
		$scope.isEditing = !$scope.isEditing
	}

	$scope.saveEdits = function(){
		console.log("save edits!!!!!" , $scope.editPayload);
		if(!$scope.editPayload.phone){$scope.editPayload.phone = 0};
		if(!$scope.editPayload.address){$scope.editPayload.address = ""};
		UserService.editAccount($scope.editPayload)

		.then(function(response){
			$scope.$emit('edit', response.data)
			$scope.user = response.data;
			$scope.isEditing = !$scope.isEditing;
			console.log(response.data, "received")
		})

	}

	$scope.uploadImage = function(image){
		console.log(image)
		UserService.uploadImage(image, $scope.user._id)
		.then(function(res){
			console.log(res.data)
			$scope.profileImageSrc = `data:image/jpeg;base64,${res.data.avatar}`;
			console.log($scope.profileImageSrc)

		})
	}

	$scope.getToMatch = function(id){
		$state.go('deathMatchPage', {"id": id})
	}


	$scope.exposeData = function(){console.log($scope.myFile)}
	UserService.isAuthed(cookies)
	.then(function(res , err){
		console.log(res.data)
		if (res.data === "authRequired"){$location.path('/login')}
		else{$scope.isLoggedIn = true;}
	})

});

'use strict';

angular.module('gameCompare')


.controller('usersListCtrl', function($scope, $location, $rootScope, $state, $cookies, UserService, jwtHelper){
	var cookies = $cookies.get('token');
	if(cookies){
		$scope.userInfo = (jwtHelper.decodeToken(cookies))
	}
	// UserService.isAuthed(cookies)
	// .then(function(res , err){
	// 	 if (res.data === "authRequired"){
	// 		//  $location.path('/login')
	// 	 }
	// 	 else{$scope.isLoggedIn = true;}
	// })
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
		// console.log("USER", user);
		if (user._id !== $scope.userInfo._id){
			return ($scope.userInfo.favorites).some(function(favorite){
				return (user._id === favorite)
			})
		} else {return true}
	}
	$scope.isUser = function(user){
		// console.log("USER", user);
		if (user._id !== $scope.userInfo._id){
				return (false)
		} else {return true}
	}
		// $scope.isAdmin = $scope.userInfo.isAdmin;

	$scope.updateSearch = function(searchTerm){
		// $scope.searchTerm = searchTerm
		console.log(searchTerm)
		if(searchTerm){
			console.log(searchTerm)
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
