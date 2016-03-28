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
