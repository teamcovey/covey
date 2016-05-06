const authServices = angular.module('auth.services', []);

authServices.factory('Auth', function ($cookies) {
  console.log($cookies['connect.sid']);
  return ({
    // isLoggedIn: () => $cookies.getObject('connect.sid'),
    isLoggedIn: () => true,
  });
});
