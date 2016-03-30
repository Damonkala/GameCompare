'use strict';

angular.module('gameCompare')

.controller('homeCtrl', function($scope, $http){
	$http.get(`/games/`).then( function victory(resp) {
		$scope.dbGames = resp.data;
	}, function failure(err) {
		console.log(err);
	});
})
