angular.module('covey.nav', [])
.controller('navController', function ($scope, $location, $rootScope) {
  // Necessary to initialize left side nav at correct height:
  if (window.innerWidth > 770) {
    $('.nav-pills').css('height', '100vh');
  }

  $scope.selection = 'details';

  $scope.navbarSwitch = (clicked) => {
    $scope.selection = clicked;
  };

  $scope.isSelected = (section) => {
    return $scope.selection === section;
  };

  $scope.toggleMenu = () => {
    $rootScope.expandMenu = !$rootScope.expandMenu;
  };
  $scope.isExpanded = () => $rootScope.expandMenu;

  $scope.navigateTo = (somePath) => {
    $location.path(somePath);
  };
});
