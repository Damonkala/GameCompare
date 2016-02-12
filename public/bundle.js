'use strict';

var app = angular.module('gameCompare', ['ui.router', 'angular-jwt', 'ngCookies','naif.base64', "base64"])


app.constant('ENV', {
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
  }

  UserService.isAuthed(cookies)
  .then(function(res , err){
    console.log(res.data)
    if (res.data !== "authRequired"){
      $state.go('usersList');
      $scope.isLoggedIn = true;
      console.log("LOGGED IN!")
    } else {
      $scope.isLoggedIn = false;
      $state.go('game');
    }
  })
  $scope.$on('loggedIn', function(){
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
    $cookies.remove('token');
    $state.go('game')
    $scope.isLoggedIn = false;
  }
  $scope.goHome = function(){
    var username = $scope.userInfo.username
    console.log("ISUSERNAME", username)
    $state.go('userPage', {"username": username})
  }
})

'use strict';

var app = angular.module('gameCompare');

app.service('UserService', function($http, ENV, $location, $rootScope, $cookies, jwtHelper){
	this.register = function(user){
		return $http.post(`${ENV.API_URL}/register`, user);
	};
	this.login = function(user){
		return $http.post(`${ENV.API_URL}/login`, user);
	};
	this.list = function(){
		return $http.get(`${ENV.API_URL}/user/list`);
	};
	this.page = function(username){
		return $http.get(`${ENV.API_URL}/user/page/${username}`)
	}
	this.auth = function(){
		return $http.get(`${ENV.API_URL}/auth`)
	};
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
			if(isLoggedIn){ return true }
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

.controller('gameCtrl', function($scope, $http, ENV, UserService, $cookies, jwtHelper, $location){

	$http.get(`${ENV.API_URL}/games/`).then( function victory(resp) {
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
		// console.log(res.data)
		 if (res.data === "authRequired"){
			//  $location.path('/login')
		 } else
		 {$scope.isLoggedIn = true;}
	})
	$scope.comparing = function(score1, score2){
		// var ign1 = Number($scope.gameOne.ign[0].criticScore);
		// var ign2 = Number($scope.gameTwo.ign[0].criticScore);
		if(Number(score1) > Number(score2) || isNaN(Number(score2)) ){
			return "isGreaterThan"
		} if(Number(score1) < Number(score2) || isNaN(Number(score1))) {
			return "isLessThan"
		} else {
			return "isEqualTo"
		}
	}
	$scope.total = function(){
		console.log("Still broken?", $scope.gameOneIgnCritic);
		if(isNaN(Number($scope.gameOneIgnCritic))){
			console.log("IGN ONE CRITIC CHANGED");
			$scope.gameOneIgnCritic = 0;
		}
		if(isNaN(Number($scope.gameTwoIgnCritic))){
			console.log("IGN TWO CRITIC CHANGED");
			$scope.gameTwoIgnCritic = 0;
		}
		if(isNaN(Number($scope.gameOneIgnUser))){
			console.log("IGN ONE CRITIC CHANGED");
			$scope.gameOneIgnUser = 0;
		}
		if(isNaN(Number($scope.gameTwoIgnUser))){
			console.log("IGN TWO CRITIC CHANGED");
			$scope.gameTwoIgnUser = 0;
		}
		$scope.gameOneCriticTotal = (
			Number($scope.gameOneSpotCritic) +
			Number($scope.gameOneIgnCritic) +
			Number($scope.gameOneRadarCritic) +
			Number($scope.gameOneMetaCritic)
		)
		console.log("GAME ONE CRITIC TOTAL:", $scope.gameOneCriticTotal);
		$scope.gameTwoCriticTotal = (
			Number($scope.gameTwoSpotCritic) +
			Number($scope.gameTwoIgnCritic) +
			Number($scope.gameTwoRadarCritic) +
			Number($scope.gameTwoMetaCritic)
		)
		if (!$scope.gameOneRadarUser) {
			$scope.gameOneRadarUser = 0;
		}
		if (!$scope.gameTwoRadarUser) {
			$scope.gameTwoRadarUser = 0;
		}
		console.log("GAME TWO CRITIC TOTAL:", $scope.gameTwoCriticTotal);
		$scope.gameOneUserTotal = (
			Number($scope.gameOneSpotUser) +
			Number($scope.gameOneIgnUser) +
			Number($scope.gameOneRadarUser) +
			Number($scope.gameOneMetaUser)
		)
		console.log("GAME ONE USER TOTAL:", $scope.gameOneUserTotal);

		$scope.gameTwoUserTotal = (
			Number($scope.gameTwoSpotUser) +
			Number($scope.gameTwoIgnUser) +
			Number($scope.gameTwoRadarUser) +
			Number($scope.gameTwoMetaUser)
		)
		console.log("GAME TWO USER TOTAL:", $scope.gameTwoUserTotal);

	}
	$scope.search = function(term){
		term = term.replace(/\s+/g, '-').toLowerCase();

		$http.get(`${ENV.API_URL}/games/search/${term}`).then( function victory(resp) {
			console.log("INFO:", resp.data.games);
			$scope.games = resp.data.games;
		}, function failure(err) {
			console.log(err);
		});
	}
	$scope.getProperReview = function(choice){
		console.log("GET REVIEWWWWW", choice);
		$http.get(`${ENV.API_URL}/games/page/scores/${choice}`).then( function victory(resp) {
			console.log("RETURN!", resp);
		}, function failure(err) {
			console.log(err);
		});
	}
	$scope.openGame = function(id, name){
		$http.get(`${ENV.API_URL}/games/page/stats/${id}`).then( function victory(resp) {
			console.log("NEW INFO:", resp);
			$scope.gameInfo = resp.data.game;
		}, function failure(err) {
			console.log(err);
		});

		$http.get(`${ENV.API_URL}/games/page/scores/${name}`).then( function victory(resp) {
			console.log("SCORES!", resp.data.result);
			console.log("Massage:", resp.data.message);
			console.log("DAAATAAA:", resp.data.possibleChoices);
			if(!resp.data.message){
				var scoreData = resp.data.result;
				$scope.gamespot = scoreData.gamespot
				$scope.gamesradar = scoreData.gamesradar
				$scope.ign = scoreData.ign
				$scope.metacritic = scoreData.metacritic
			}
			$scope.choices = resp.data.possibleChoices
			console.log("choice", $scope.choices);
		}, function failure(err) {
			console.log(err);
		});
	}

	$scope.startBattle = function(){
		console.log($scope.gameOne, " V.S ", $scope.gameTwo);
		var deathmatch = {};
		deathmatch.user = $scope.userInfo._id;
		deathmatch.game1 = $scope.gameOne;
		deathmatch.game2 = $scope.gameTwo;
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
		console.log("Comparison", games);
		$http.post(`${ENV.API_URL}/games/compare`, games).then(function victory(resp){
			console.log("GAME ONE BEING", resp.data[0][0]);
			console.log("GAME TWO BEING", resp.data[1][0]);
			$scope.gameOne = resp.data[0][0];
			$scope.gameTwo = resp.data[1][0];
			var gameOne = $scope.gameOne
			var gameTwo = $scope.gameTwo

			console.log("YOU ARE EL!", gameOne.url);
			$scope.gameOneurl = gameOne.url;
			$scope.gameTwourl = gameTwo.url;
			$scope.gameOneCover = gameOne.cover[0].url
			$scope.gameTwoCover = gameTwo.cover[0].url

			$scope.gameOneRadarCritic = gameOne.gamesradar[0].criticScore
			$scope.gameOneRadarUser = gameOne.gamesradar[0].userScore
			$scope.gameOneRadarUrl = gameOne.gamesradar[0].url

			$scope.gameTwoRadarCritic = gameTwo.gamesradar[0].criticScore
			$scope.gameTwoRadarUser = gameTwo.gamesradar[0].userScore
			$scope.gameTwoRadarUrl = gameTwo.gamesradar[0].url

			$scope.gameOneIgnCritic = gameOne.ign[0].criticScore
			console.log("BROKEN?!", $scope.gameOneIgnCritic);
			$scope.gameOneIgnUser = gameOne.ign[0].userScore
			$scope.gameOneIgnUrl = gameOne.ign[0].url

			$scope.gameTwoIgnCritic = gameTwo.ign[0].criticScore
			$scope.gameTwoIgnUser = gameTwo.ign[0].userScore
			$scope.gameTwoIgnUrl = gameTwo.ign[0].url

			$scope.gameOneMetaCritic = gameOne.metacritic[0].criticScore
			$scope.gameOneMetaUser = gameOne.metacritic[0].userScore
			$scope.gameOneMetaUrl = gameOne.metacritic[0].url

			$scope.gameTwoMetaCritic = gameTwo.metacritic[0].criticScore
			$scope.gameTwoMetaUser = gameTwo.metacritic[0].userScore
			$scope.gameTwoMetaUrl = gameTwo.metacritic[0].url


			$scope.gameOneSpotCritic = gameOne.gamespot[0].criticScore
			$scope.gameOneSpotUser = gameOne.gamespot[0].userScore
			$scope.gameOneSpotUrl = gameOne.gamespot[0].url

			$scope.gameTwoSpotCritic = gameTwo.gamespot[0].criticScore
			$scope.gameTwoSpotUser = gameTwo.gamespot[0].userScore
			$scope.gameTwoSpotUrl = gameTwo.gamespot[0].url


			$scope.total();
		}, function failure(err){
			console.log(err);
		})
	}
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

angular.module('gameCompare')

.controller('listCtrl', function($scope, $http, ENV){
	$http.get(`${ENV.API_URL}/games/`).then( function victory(resp) {
		console.log("INFO:", resp.data);
		$scope.dbGames = resp.data;
	}, function failure(err) {
		console.log(err);
	});
})

'use strict';

angular.module('gameCompare')
.controller('loginCtrl', function($scope, $state, $rootScope, UserService, jwtHelper, $cookies){
	console.log("LOADAED");
	$scope.submit = function(user){
		UserService.login(user)
		.then(function(res){
			console.log('res', res.data)
			if(res.data=="login succesfull"){
						// console.log("EUSER", user)
						UserService.loggedIn = 'true';
						$scope.$emit('loggedIn');
						$state.go('userPage', {"username": user.username})
			} else if (res.data === "Incorrect Username or Password!"){
			swal({
				type: "error",
				title: "Uh-Oh!",
				text: res.data,
				showConfirmButton: true,
				confirmButtonText: "I hear ya.",
			});
      }
			var token = $cookies.get('token');
      var decoded = jwtHelper.decodeToken(token);
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

.controller('searchCtrl', function($scope, $http, ENV){
	$scope.search = function(term){
		term = term.replace(/\s+/g, '-').toLowerCase();
		$http.get(`${ENV.API_URL}/games/search/${term}`).then( function victory(resp) {
			console.log("INFO:", resp.data.games);
			$scope.games = resp.data.games;
		}, function failure(err) {
			console.log(err);
		});
	}
	$scope.openGame = function(id, name){
		$http.get(`${ENV.API_URL}/games/page/stats/${id}`).then( function victory(resp) {
			// name = name.replace(/\s+/g, '-').toLowerCase();
			// name = name.replace(":", '')
			// name = name.replace(/^[^']*$/, '-')
			console.log("NEW INFO:", resp);
			$scope.url = `https://www.igdb.com/games/${resp.data.game.slug}`;
			// console.log("GAYMME.", `https://www.igdb.com/games/${name}`);
			$scope.gameInfo = resp.data.game;
		}, function failure(err) {
			console.log(err);
		});
		$scope.reviews = false;

		$http.get(`${ENV.API_URL}/games/page/scores/${name}`).then( function victory(resp) {
			$scope.reviews = false;
			console.log("SCORES!", resp.data.result);
			console.log("Massage:", resp.data.message);
			console.log("DAAATAAA:", resp.data.possibleChoices);
			if(!resp.data.message){
				$scope.reviews = true;
				var scoreData = resp.data.result;
				$scope.gamespot = scoreData.gamespot
				$scope.gamesradar = scoreData.gamesradar
				$scope.ign = scoreData.ign
				$scope.metacritic = scoreData.metacritic
			}
			$scope.choices = resp.data.possibleChoices
			console.log("choice", $scope.choices);
		}, function failure(err) {
			console.log(err);
		});
	}
	$scope.saveGame = function(){
		console.log("Shaving");
		var newGame = {}
		newGame.companies = $scope.gameInfo.companies
		newGame.url = $scope.url
		newGame.cover = $scope.gameInfo.cover
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

		$http.post(`${ENV.API_URL}/games`, newGame).then( function victory(resp) {
			console.log(resp.data)
		}, function failure(err) {
			console.log(err);
		});
	}
})

'use strict';

angular.module('gameCompare')


.controller('deathMatchListCtrl', function($scope, $location, $rootScope, $state, $cookies, $http, ENV){
	$http.get(`${ENV.API_URL}/deathMatches/`).then( function victory(resp) {
		console.log("INFO:", resp.data);
		$scope.deathMatches = resp.data;
	}, function failure(err) {
		console.log(err);
	});
	$scope.comparing = function(score1, score2){
		if(Number(score1) > Number(score2) || isNaN(Number(score2)) ){
			return "isGreaterThan"
		} if(Number(score1) < Number(score2) || isNaN(Number(score1))) {
			return "isLessThan"
		} else {
			return "isEqualTo"
		}
	}
})

'use strict';

angular.module('gameCompare')


.controller('deathMatchPageCtrl', function($scope, $state, UserService, $cookies, jwtHelper, $location , $base64, $http, ENV){
	console.log("WO HO");
	console.log("PURAMS", $state.params.id);
	var cookies = $cookies.get('token');
	if(cookies){
		$scope.userInfo = (jwtHelper.decodeToken(cookies))
		console.log("I AM ", $scope.userInfo);
	}
	UserService.isAuthed(cookies)
	.then(function(res , err){
		// console.log(res.data)
		if (res.data === "authRequired"){
			//  $location.path('/login')
		} else
		{$scope.isLoggedIn = true;}
	})
	$http.get(`${ENV.API_URL}/deathMatches/${$state.params.id}`).then( function victory(resp) {
		console.log("INFO:", resp.data);
		// $scope.deathMatch = resp.data;
		$scope.gameOne = resp.data.game1;
		$scope.gameTwo = resp.data.game2;

		$scope.game1UserReviews = resp.data.game1UserReviews
		$scope.game2UserReviews = resp.data.game2UserReviews
		
		var gameOne = $scope.gameOne
		var gameTwo = $scope.gameTwo
		console.log("YOU ARE EL!", gameOne.url);
		$scope.gameOneurl = gameOne.url;
		$scope.gameTwourl = gameTwo.url;
		$scope.gameOneCover = gameOne.cover[0].url
		$scope.gameTwoCover = gameTwo.cover[0].url

		$scope.gameOneRadarCritic = gameOne.gamesradar[0].criticScore
		$scope.gameOneRadarUser = gameOne.gamesradar[0].userScore
		$scope.gameOneRadarUrl = gameOne.gamesradar[0].url

		$scope.gameTwoRadarCritic = gameTwo.gamesradar[0].criticScore
		$scope.gameTwoRadarUser = gameTwo.gamesradar[0].userScore
		$scope.gameTwoRadarUrl = gameTwo.gamesradar[0].url

		$scope.gameOneIgnCritic = gameOne.ign[0].criticScore
		console.log("BROKEN?!", $scope.gameOneIgnCritic);
		$scope.gameOneIgnUser = gameOne.ign[0].userScore
		$scope.gameOneIgnUrl = gameOne.ign[0].url

		$scope.gameTwoIgnCritic = gameTwo.ign[0].criticScore
		$scope.gameTwoIgnUser = gameTwo.ign[0].userScore
		$scope.gameTwoIgnUrl = gameTwo.ign[0].url

		$scope.gameOneMetaCritic = gameOne.metacritic[0].criticScore
		$scope.gameOneMetaUser = gameOne.metacritic[0].userScore
		$scope.gameOneMetaUrl = gameOne.metacritic[0].url

		$scope.gameTwoMetaCritic = gameTwo.metacritic[0].criticScore
		$scope.gameTwoMetaUser = gameTwo.metacritic[0].userScore
		$scope.gameTwoMetaUrl = gameTwo.metacritic[0].url


		$scope.gameOneSpotCritic = gameOne.gamespot[0].criticScore
		$scope.gameOneSpotUser = gameOne.gamespot[0].userScore
		$scope.gameOneSpotUrl = gameOne.gamespot[0].url

		$scope.gameTwoSpotCritic = gameTwo.gamespot[0].criticScore
		$scope.gameTwoSpotUser = gameTwo.gamespot[0].userScore
		$scope.gameTwoSpotUrl = gameTwo.gamespot[0].url

		$scope.total();

	}, function failure(err) {
		console.log(err);
	});
	$scope.total = function(){
		console.log("Still broken?", $scope.gameOneIgnCritic);
		if(isNaN(Number($scope.gameOneIgnCritic))){
			console.log("IGN ONE CRITIC CHANGED");
			$scope.gameOneIgnCritic = 0;
		}
		if(isNaN(Number($scope.gameTwoIgnCritic))){
			console.log("IGN TWO CRITIC CHANGED");
			$scope.gameTwoIgnCritic = 0;
		}
		if(isNaN(Number($scope.gameOneIgnUser))){
			console.log("IGN ONE CRITIC CHANGED");
			$scope.gameOneIgnUser = 0;
		}
		if(isNaN(Number($scope.gameTwoIgnUser))){
			console.log("IGN TWO CRITIC CHANGED");
			$scope.gameTwoIgnUser = 0;
		}
		$scope.gameOneCriticTotal = (
			Number($scope.gameOneSpotCritic) +
			Number($scope.gameOneIgnCritic) +
			Number($scope.gameOneRadarCritic) +
			Number($scope.gameOneMetaCritic)
		)
		console.log("GAME ONE CRITIC TOTAL:", $scope.gameOneCriticTotal);
		$scope.gameTwoCriticTotal = (
			Number($scope.gameTwoSpotCritic) +
			Number($scope.gameTwoIgnCritic) +
			Number($scope.gameTwoRadarCritic) +
			Number($scope.gameTwoMetaCritic)
		)
		if (!$scope.gameOneRadarUser) {
			$scope.gameOneRadarUser = 0;
		}
		if (!$scope.gameTwoRadarUser) {
			$scope.gameTwoRadarUser = 0;
		}
		console.log("GAME TWO CRITIC TOTAL:", $scope.gameTwoCriticTotal);
		$scope.gameOneUserTotal = (
			Number($scope.gameOneSpotUser) +
			Number($scope.gameOneIgnUser) +
			Number($scope.gameOneRadarUser) +
			Number($scope.gameOneMetaUser)
		)
		console.log("GAME ONE USER TOTAL:", $scope.gameOneUserTotal);

		$scope.gameTwoUserTotal = (
			Number($scope.gameTwoSpotUser) +
			Number($scope.gameTwoIgnUser) +
			Number($scope.gameTwoRadarUser) +
			Number($scope.gameTwoMetaUser)
		)
		console.log("GAME TWO USER TOTAL:", $scope.gameTwoUserTotal);

	}
	$scope.writeReview = function(content, game){
		console.log("is it game", game);
		var review = {}
		review.game = game
		review.deathMatch = $state.params.id;
		review.user = $scope.userInfo._id;
		review.review = content;
		$http.put(`${ENV.API_URL}/deathMatches/${$state.params.id}`, review).then( function victory(resp){
			console.log("HOORA", resp);
		}), function failure(err){
			console.log("O no ", err);
		}
	}
	$scope.comparing = function(score1, score2){
		if(Number(score1) > Number(score2) || isNaN(Number(score2)) ){
			return "isGreaterThan"
		} if(Number(score1) < Number(score2) || isNaN(Number(score1))) {
			return "isLessThan"
		} else {
			return "isEqualTo"
		}
	}
});

'use strict';

angular.module('gameCompare')


.controller('userPageCtrl', function($scope, $state, UserService, $cookies, jwtHelper, $location , $base64){
	$scope.user = {};
	$scope.editPayload = {};
	var cookies = $cookies.get('token');
	var token = jwtHelper.decodeToken(cookies)
	// if(cookies){
	// 	$scope.userInfo = (jwtHelper.decodeToken(cookies))
	// }
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
	UserService.isAuthed(cookies)
	.then(function(res , err){
		// console.log(res.data)
		 if (res.data === "authRequired"){$location.path('/login')}
		 else{$scope.isLoggedIn = true;}
	})
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
		$scope.isAdmin = $scope.userInfo.isAdmin;

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
