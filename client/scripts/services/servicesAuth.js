const coveyServicesAuth = angular.module('covey.services.auth', []);

coveyServicesAuth.factory('Auth', ($window) => {
  return ({
    const isLoggedIn = () => {
      return !!$window.localStorage.getItem('com.codellama');
    };
  });
});
