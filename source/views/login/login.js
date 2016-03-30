'use strict';

angular.module('gameCompare')
.controller('loginCtrl', function($scope, $state, $rootScope, UserService, jwtHelper, $cookies){
	$scope.submit = function(user){
		UserService.login(user)
		.then(function(res){
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
				var decoded = jwtHelper.decodeToken(token);
				UserService.loggedIn = 'true';
				$scope.$emit('loggedIn')
				$state.go('userPage', {"username": user.username})
			}
		}, function(err) {
			console.error(err);
		});
	}
});
