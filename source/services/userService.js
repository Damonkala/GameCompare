'use strict';

var app = angular.module('gameCompare');

app.service('UserService', function($http, ENV, $location, $rootScope, $cookies, jwtHelper){
	this.register = function(user){
		return $http.post(`${ENV.API_URL}/register`, user);
	};
	this.login = function(user){
		// console.log("2: IS THERE A USER", user);
		return $http.get(`${ENV.API_URL}/login/test`);
		// return $http.post(`${ENV.API_URL}/login`, user);
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
