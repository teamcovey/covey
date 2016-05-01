const hamburger = angular.module('hamburger', []);

hamburger.controller('hamburgerController', ($scope) => {
  $scope.showMenu = false;

  $scope.toggleMenu = () => {
    $scope.showMenu = !$scope.showMenu;
  };
});
