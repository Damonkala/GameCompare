'use strict';

var app = angular.module('gameCompare');

app.service('UserReviewService', function($http, $location, $rootScope, $cookies, jwtHelper){
	this.writeReview = function(id, review){
		return $http.put(`/deathMatches/${id}`, review)
	};
	this.vote = function(currentUserId, reviewVotedForId, authorVotedForId, voteValue){
		return $http.put('/userReviews/vote', {currentUserId: currentUserId, reviewVotedForId: reviewVotedForId, authorVotedForId: authorVotedForId, voteValue: voteValue})
	}
	this.wroteReview = function(userInfoId, deathMatchId){
		return $http.post(`/userReviews/wroteReview`, {userInfo: userInfoId, deathMatch: deathMatchId})
	};
	this.hasVoted = function(userId, reviewId){
		return $http.post('/userReviews/hasVoted', {userId: userId, reviewId: reviewId})
	}
})
