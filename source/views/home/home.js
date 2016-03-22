'use strict';

angular.module('gameCompare')

.controller('homeCtrl', function($scope, $http){
	$http.get(`/games/`).then( function victory(resp) {
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
