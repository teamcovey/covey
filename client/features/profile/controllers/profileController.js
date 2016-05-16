angular.module('profile', ['profile.services'])

.controller('profileController', function ($scope, $location, profileService, userIdFactory) {
  if (window.innerWidth > 770) {
    $('.covey').css('width', '97%');
  }

  $(window).resize(() => {
    if (window.innerWidth > 770) {
      $('ul.nav-pills').css('height', '100vh');
      $('.covey').css('width', '97%');
    } else {
      $('ul.nav-pills').css('height', '');
      $('.covey').css('width', '');
    }
  });
  $scope.selection = 'details';

  $scope.navbarSwitch = (clicked) => {
    $scope.selection = clicked;
  };

  $scope.isSelected = (section) => {
    return $scope.selection === section;
  };

  $scope.expandMenu = true;
  $scope.toggleMenu = () => {
    $scope.expandMenu = !$scope.expandMenu;
  };
  $scope.isExpanded = () => $scope.expandMenu;

  $scope.navigateTo = (somePath) => {
    $location.path(somePath);
  };

  const userId = userIdFactory.getUserId();
  $scope.email = '';
  $scope.phoneNumber = '';
  $scope.editDetails = false;

  profileService.getUser(userId)
    .then((response) => {
      $scope.firstName = response.data.user.firstName;
      $scope.lastName = response.data.user.lastName;
      $scope.email = response.data.user.email;
      
      /*
       * This is a quick fix if the user saves a blank phone number to the database.
       * If nothing is sent to the server api it will not update the entry,
       * so by sending in a blank space and using it as an identifier on read,
       * we can create an empty entry.
      */
      if (!response.data.user.phoneNumber || response.data.user.phoneNumber === ' ') {
        $scope.phoneNumber = 'please add your phone number';
      } else {
        $scope.phoneNumber = response.data.user.phoneNumber;
      }

      $scope.photoUrl = response.data.user.photoUrl;
      $scope.showPhoto = $scope.photoUrl ? true : false;
    });

  $scope.save = () => {
    const details = {};
    details.email = $scope.email;
    details.phoneNumber = $scope.phoneNumber;

    // save space char as empty entry identifier so server api doesn't ignore update
    $scope.phoneNumber === '' ?
      details.phoneNumber = ' ' :
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
