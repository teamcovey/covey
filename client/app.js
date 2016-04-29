angular.module('covey', [
  // TODO: Add additional dependencies
  'ngRoute',
])
.config(($routeProvider) => {
  $routeProvider
    .when('/', {
      templateURL: 'views/index.html',
      controller: 'loginController',
    })
    .when('/coveys', {
      templateURL: 'views/coveys.html',
      controller: 'coveysController',
    })
    .when('/covey', {
      templateURL: 'views/covey.html',
      controller: 'coveysController',
    });
})
.run(() => {
});
