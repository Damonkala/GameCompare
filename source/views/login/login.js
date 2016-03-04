'use strict';

angular.module('gameCompare')
.controller('loginCtrl', function($scope, $state, $rootScope, UserService, jwtHelper, $cookies){
	$scope.submit = function(user){
		UserService.login(user)
		.then(function(res){
			console.log('res', res.data)
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
				console.log("This Here is a Token:", token);
				var decoded = jwtHelper.decodeToken(token);
				UserService.loggedIn = 'true';
				$state.go('userPage', {"username": user.username})
			}
		}, function(err) {
			console.error(err);
		});
	}
});
