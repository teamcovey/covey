angular.module('index.controller', ['ngCookies'])

.controller('indexController', function ($scope, $cookies) {
  // document.cookie = 'new_user = false';
  $cookies.remove('new_user');
  $scope.setCookie = () => {
    document.cookie = 'new_user = true';
  };
});
