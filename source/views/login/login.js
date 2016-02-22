'use strict';

angular.module('gameCompare')
.controller('loginCtrl', function($scope, $state, $rootScope, UserService, jwtHelper, $cookies){
	console.log("LOADAED");
	$scope.submit = function(user){
		console.log("1: IS THERE A USER", user);
		// debugger;
		UserService.login(user)
		.then(function(res){
			console.log('res', res.data)
			if(res.data=="login succesfull"){
				console.log("DID WE TRY TO LOGIN?");
				UserService.loggedIn = 'true';
				$scope.$emit('loggedIn');
				// $state.go('userPage', {"username": user.username})
			} else if (res.data === "Incorrect Username or Password!"){
				swal({
					type: "error",
					title: "Uh-Oh!",
					text: res.data,
					showConfirmButton: true,
					confirmButtonText: "I hear ya.",
				});
			}
			var token = $cookies.get('token');
			console.log("This Here is a Token:", token);
			var decoded = jwtHelper.decodeToken(token);
		}, function(err) {
			console.error(err);
		});
	}

});
