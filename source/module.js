'use strict';

var app = angular.module('gameCompare', ['ui.router', 'angular-jwt', 'ngCookies','naif.base64', "base64"])


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
      // $state.go('game');
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
