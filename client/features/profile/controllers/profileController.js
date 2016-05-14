angular.module('profile', ['profile.services'])

.controller('profileController', function ($scope, profileService, userIdFactory) {
  const userId = userIdFactory.getUserId();
  $scope.email = '';
  $scope.phoneNumber = '';
  $scope.editDetails = false;

  profileService.getUser(userId)
    .then((response) => {
      $scope.firstName = response.data.user.firstName;
      $scope.lastName = response.data.user.lastName;
      $scope.email = response.data.user.email;
      
      if (!response.data.user.phoneNumber) {
        $scope.phoneNumber = 'No phone number saved';
      } else {
        $scope.phoneNumber = response.data.user.phoneNumber;
      }

      // $scope.phoneNumber = response.data.user.phoneNumber;
      // $scope.phoneNumber = '07766564019';
      $scope.photoUrl = response.data.user.photoUrl;
      $scope.showPhoto = $scope.photoUrl ? true : false;
    });

  $scope.save = () => {
    const details = {};
    details.email = $scope.email;
    details.phoneNumber = $scope.phoneNumber;

    $scope.toggleEdit();
    profileService.updateUser(userId, details)
      .then(
        (response) => console.log('Save sucessful'),
        (err) => console.error(err)
      );
  };

  $scope.toggleEdit = () => {
    $scope.editDetails = !$scope.editDetails;
  };
});
