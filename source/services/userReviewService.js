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
