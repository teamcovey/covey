angular.module('covey.index', ['ngCookies'])

.controller('indexController', function ($scope, $cookies, indexService) {
  // document.cookie = 'new_user = false';
  $cookies.remove('new_user');
  $scope.setCookie = () => {
    document.cookie = 'new_user = true';
  };
});
