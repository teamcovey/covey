const hamburger = angular.module('hamburger', []);

hamburger.controller('hamburgerController', function ($scope) {
  $scope.showMenu = false;
  // Toggles visibility of hamburger meny
  $scope.toggleMenu = () => {
    $scope.showMenu = !$scope.showMenu;
  };

  // $scope.goToAbout = () => {
  //   $location.path(`/coveys/${coveyId}`);
  // };
});
