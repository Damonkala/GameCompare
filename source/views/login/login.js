'use strict';

angular.module('gameCompare')
.controller('loginCtrl', function($scope, $state, $rootScope, UserService, jwtHelper, $cookies){
	$scope.submit = function(user){
		UserService.login(user)
		.then(function(res){
			console.log('res', res.data)
			if(res.data === "Incorrect Username or Password!"){
				swal({
					type: "error",
					title: "Uh-Oh!",
					text: res.data,
					showConfirmButton: true,
					confirmButtonText: "I hear ya.",
				});
			} else{
				console.log("Here is the data, the data is here", res.data);
				console.log("DID WE TRY TO LOGIN?");
				UserService.loggedIn = 'true';
				$scope.$emit('loggedIn');
				// $state.go('userPage', {"username": user.username})
				document.cookie = 'token' + "=" + res.data;
				var token = $cookies.get('token');
				console.log("This Here is a Token:", token);
				var decoded = jwtHelper.decodeToken(token);
			}
		}, function(err) {
			console.error(err);
		});
	}

});
// 'use strict';
//
// angular.module('gameCompare')
// .controller('loginCtrl', function($scope, $state, $rootScope, UserService, jwtHelper, $cookies){
// 	$scope.submit = function(user){
// 		UserService.login(user)
// 		.then(function(res){
// 			console.log('res', res.data)
// 			if(res.data=="login succesfull"){
// 				console.log("DID WE TRY TO LOGIN?");
// 				UserService.loggedIn = 'true';
// 				$scope.$emit('loggedIn');
// 				// $state.go('userPage', {"username": user.username})
// 			} else if (res.data === "Incorrect Username or Password!"){
// 				swal({
// 					type: "error",
// 					title: "Uh-Oh!",
// 					text: res.data,
// 					showConfirmButton: true,
// 					confirmButtonText: "I hear ya.",
// 				});
// 			}
// 			var token = $cookies.get('token');
// 			console.log("This Here is a Token:", token);
// 			var decoded = jwtHelper.decodeToken(token);
// 		}, function(err) {
// 			console.error(err);
// 		});
// 	}
//
// });
