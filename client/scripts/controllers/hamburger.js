const hamburger = angular.module('hamburger', []);

hamburger.controller('hamburgerController', ($scope) => {
  $scope.showMenu = false;
  // Toggles visibility of hamburger meny
  $scope.toggleMenu = () => {
    $scope.showMenu = !$scope.showMenu;
  };
});
