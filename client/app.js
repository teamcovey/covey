angular.module('covey', [
  // TODO: Add additional dependencies
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
    .when('/covey', {
      templateUrl: 'views/covey.html',
      controller: 'coveyController',
    });
})
.run(() => {
});
