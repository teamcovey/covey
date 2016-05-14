angular.module('profile', ['profile.services'])

.controller('profileController', function ($scope, profileService, userIdFactory) {
  const userId = userIdFactory.getUserId();

  profileService.getUser(userId)
    .then((response) => {
      $scope.firstName = response.data.user.firstName;
      $scope.lastName = response.data.user.lastName;
      $scope.email = response.data.user.email;
      //$scope.phoneNumber = response.data.user.phoneNumber;
      $scope.phoneNumber = '07766564019';
      $scope.photoUrl = response.data.user.photoUrl;
      $scope.showPhoto = $scope.photoUrl ? true : false;
    });
});
