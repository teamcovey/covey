angular.module('covey', [
  // TODO: Add additional dependencies
  'covey.attendees',
  'covey.supplies',
  'covey.rides',
  'covey.covey',
  'covey.services',
  'createCovey',
  'coveys',
  'hamburger',
  'ngRoute',
  'covey.services.auth',
])
.config(($routeProvider) => {
  $routeProvider
    .when('/', {
      templateUrl: 'views/index.html',
      controller: 'loginController',
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
  // $rootScope.loggedIn = Auth.isLoggedIn();
});
