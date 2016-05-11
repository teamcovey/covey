angular.module('covey', [
  'covey.attendees',
  'covey.supplies',
  'covey.rides',
  'covey.covey',
  'covey.services',
  'userId.services',
  'date.services',
  'ngCookies',
  'auth.controller',
  'createCovey',
  'coveys',
  'friends',
  'hamburger',
  'ngRoute',
  'covey.chat',
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
    })
    .when('/coveys/:coveyId', {
      templateUrl: 'features/covey/views/coveyView.html',
      controller: 'coveyController',
    })
    .when('/friends', {
      templateUrl: 'features/friends/views/friends.html',
      controller: 'friendsController',
    })
    .otherwise({
      redirectTo: '/',
    });
})
.run(() => {
});
