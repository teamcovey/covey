angular.module('covey', [
  // TODO: Add additional dependencies
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
      controller: 'coveysController',
    });
})
.run(() => {
});
