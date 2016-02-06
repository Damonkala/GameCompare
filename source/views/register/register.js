'use strict';

angular.module('gameCompare')


.controller('registerCtrl', function($scope, $state, UserService){
	console.log("LODADED");
	$scope.submit = function(user){
		if(user.password !== user.password2){
			swal({
				type: "warning",
				title: "Passwords don't match!",
				text: "Matching passwords only please",
				showConfirmButton: true,
				confirmButtonText: "Gotcha.",
			});
			return;
		}
		if(!user.email){
			swal({
				type: "error",
				title: "Give us your email address!",
				text: "C'mon, we know that's a fake!",
				showConfirmButton: true,
				confirmButtonText: "I hear ya.",
			});
			return;
		}
		UserService.register(user)

		.then(function(data){
			swal({
				type: "success",
				title: "Successful registration!",
				text: "Hurray. You're a User!",
				imageUrl: "images/thumbs-up.jpg"
			});			$state.go('login');
		}, function(err){
			console.log(err);
		});
	}
});
