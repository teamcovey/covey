angular.module('covey.welcome', ['ngCookies'])

.controller('welcomeController', function ($scope, $cookies, welcomeService) {
  $scope.visible = false;
  $scope.showVerify = false;
  $scope.name = '';
  $scope.code = 0;
  $scope.inputCode = '';
  $scope.phoneNumber = '';

  /*
   * Checks if new_user cookie exists.
   * This only exists if the 'sign up' button has been clicked.
   * TODO: This functionality has been replaced by the hasTel check but
   * is incomplete. There needs to be a way to check if user is not new
   * and has clicked the sign-up button and then asks them to login.
   */

  // if ($cookies.getObject('new_user')) {
  //   $scope.visible = true;
  // }

  const userId = $cookies.getObject('user_id');

  welcomeService.getUser(userId)
    .then((user) => {
      $scope.name = user;
    });

  $scope.toggleWelcomeModalVisibility = () => {
    $scope.visible = !$scope.visible;
  };

  $scope.showVerifyVisibility = () => {
    $scope.showVerify = true;
  };

  /*
   * Shows vefication code input field
   * Gets verification code from the server
   */
  $scope.verify = () => {
    $scope.showVerifyVisibility();

    return welcomeService.getVerificationCode($scope.phoneNumber)
      .then((response) => {
        $scope.code = response.data.code;
        console.log(response.data.code);
      })
      .catch((err) => console.error(err));
  };

  /*
   * Compares user inputted code with code generated by server.
   * Saves telephone number to database if codes match
   */
  $scope.compare = () => {
    if ($scope.code === +$scope.inputCode) {
      welcomeService.saveTel($scope.phoneNumber)
      .then((response) => {
        if (response) {
          $scope.toggleWelcomeModalVisibility();
        }
      })
      .catch((err) => console.error(err));
    } else {
      console.log('Code does not match');
    }
  };

  $scope.checkCode = () => {
    $scope.visible = false;
  };

  /*
   * Checks to see if user has telephone number in database.
   * If not, assumes that the user is new and so displays the welcome modal
   */
  $scope.hasTel = () => {
    welcomeService.hasTel()
      .then((response) => {
        if (response.data) {
          $scope.visible = false;
        } else {
          $scope.visible = true;
        }
      })
      .catch((err) => console.error(err));
  };

  $scope.hasTel();
});
