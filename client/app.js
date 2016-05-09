angular.module('covey', [
  'covey.attendees',
  'covey.supplies',
  'covey.rides',
  'covey.covey',
  'covey.services',
  'userId.services',
  'ngCookies',
  'auth.controller',
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
    .when('/about', {
      templateUrl: 'views/about.html',
      controller: 'authController',
    })
    .when('/coveys', {
      templateUrl: 'features/coveys/views/coveys.html',
      controller: 'coveysController',
    })
    .when('/coveys/:coveyId', {
      templateUrl: 'features/covey/views/coveyView.html',
      controller: 'coveyController',
    })
    .otherwise({
      redirectTo: '/',
    });
})
.run(() => {
});
