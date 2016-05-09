angular.module('welcome', ['ngCookies'])

.controller('welcomeController', function ($scope, $cookies) {
  $scope.visible = false;


  if ($cookies.getObject('new_user')) {
    $scope.visible = true;
    console.log('In if: ', $cookies.getObject('new_user'));
    // $cookies.remove('new_user');
  }

  $scope.toggleWelcomeModalVisibility = () => {
    $scope.visible = !$scope.visible;
  };
});


  // if (document.cookie = 'new_user = true') {
  //   $scope.visible = true;
  // }
