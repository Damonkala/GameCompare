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
	this.wroteReview = function(userInfoId, deathMatchId){
		console.log("Made it to service!");
		return $http.post(`${ENV.API_URL}/deathMatches/wroteReview`, {userInfo: userInfoId, deathMatch: deathMatchId})
	};
	this.hasVoted = function(userId, reviewId){
		return $http.post('/deathMatches/hasVoted', {userId: userId, reviewId: reviewId})
	}
})
