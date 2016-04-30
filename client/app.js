angular.module('covey', [
  // TODO: Add additional dependencies
  'covey.attendees',
  'covey.supplies',
  'covey.rides',
  'covey.covey',
  'ngRoute',
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
    .when('/covey/:id', {
      templateUrl: 'views/covey.html',
      controller: 'coveyController',
    })
    .otherwise({
      redirectTo: '/',
    });
})
.run(() => {
});
