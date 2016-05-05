const coveyServicesAuth = angular.module('covey.services.auth', []);

coveyServicesAuth.factory('Auth', ($window) => {
  return ({
    // isLoggedIn: () => !!$window.localStorage.getItem('com.codellama'),
  });
});
