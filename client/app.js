angular.module('covey', [
  // TODO: Add additional dependencies
  'covey.attendees',
  'covey.supplies',
  'covey.rides',
  'covey.covey',
  'covey.services',
  'ngCookies',
  'auth.controller',
  'auth.services',
  'createCovey',
  'coveys',
  'hamburger',
  'ngRoute',
])
.config(($routeProvider) => {
  $routeProvider
    .when('/', {
      templateUrl: 'views/index.html',
      controller: 'authController',
    })
    .when('/coveys', {
      templateUrl: 'views/coveys.html',
      controller: 'coveysController',
    })
    .when('/coveys/:coveyId', {
      templateUrl: 'views/covey.html',
      controller: 'coveyController',
    })
    .otherwise({
      redirectTo: '/',
    });
})
.run(($rootScope, Auth) => {
  //$rootScope.loggedIn = Auth.isLoggedIn();
  //$rootScope.loggedIn = Auth.isLoggedIn();
});
