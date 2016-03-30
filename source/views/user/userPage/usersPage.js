'use strict';

angular.module('gameCompare')


.controller('userPageCtrl', function($scope, $state, UserService, $cookies, jwtHelper, $location , $base64, $rootScope){
	$scope.user = {};
	$scope.editPayload = {};
	var cookies = $cookies.get('token');
	if(cookies){
		var token = jwtHelper.decodeToken(cookies)
		$scope.userInfo = (jwtHelper.decodeToken(cookies))
		UserService.isAuthed(cookies)
		.then(function(res, err){
			if (res.data === "authRequired"){
				// $location.path('/login')
			} else{
				$rootScope.isLoggedIn = true;
			}
		})
}
	UserService.page($state.params.username)
	.then(function(res) {
		$scope.user = res.data;
		$scope.favorites = res.data.favorites;
		if(token){
			$scope.isOwnPage = $scope.user.username === token.username || token.isAdmin === true;
			$scope.isEditing = false;
			$scope.editPayload.username = $scope.user.username;
			$scope.editPayload.email = $scope.user.email;

			$scope.editPayload.phone = $scope.user.phone;
			$scope.editPayload.name = $scope.user.name
			$scope.editPayload.address = $scope.user.address
			$scope.editPayload._id = $scope.user._id
			$scope.editPayload.isAdmin = token.isAdmin
		}
		if(res.data.avatar){
			$scope.profileImageSrc = `data:image/jpeg;base64,${$scope.user.avatar}`;
		} else {
			$scope.profileImageSrc = `http://gitrnl.networktables.com/resources/userfiles/nopicture.jpg`
		}

	}, function(err) {
		console.error(err)
	});
	$scope.test = function(){
	}
	$scope.removeFavorite = function (userId){
		UserService.unFavoriteUser(userId)
		.then(function(res){
			$scope.userInfo = res.data
			var cookie = $cookies.get('token');
			var token = jwtHelper.decodeToken(cookie);
			$scope.favorites = $scope.userInfo.favorites;
		})
	}

	$scope.toggleEdit = function(){
		$scope.isEditing = !$scope.isEditing
	}

	$scope.saveEdits = function(){
		if(!$scope.editPayload.phone){$scope.editPayload.phone = 0};
		if(!$scope.editPayload.address){$scope.editPayload.address = ""};
		UserService.editAccount($scope.editPayload)

		.then(function(response){
			$scope.$emit('edit', response.data)
			$scope.user = response.data;
			$scope.isEditing = !$scope.isEditing;
		})

	}

	$scope.uploadImage = function(image){
		UserService.uploadImage(image, $scope.user._id)
		.then(function(res){
			$scope.profileImageSrc = `data:image/jpeg;base64,${res.data.avatar}`;

		})
	}

	$scope.getToMatch = function(id){
		$state.go('deathMatchPage', {"id": id})
	}


	$scope.exposeData = function(){console.log($scope.myFile)}
	UserService.isAuthed(cookies)
	.then(function(res , err){
		if (res.data === "authRequired"){
			// $location.path('/login')
		}
		else{
			$scope.isLoggedIn = true;
		}
	})

});
