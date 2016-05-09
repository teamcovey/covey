angular.module('covey', [
  'covey.attendees',
  'covey.supplies',
  'covey.rides',
  'covey.covey',
  'covey.services',
  'userId.services',
  'date.services',
  'ngCookies',
  'index.controller',
  'auth.controller',
  'createCovey',
  'welcome',
  'coveys',
  'friends',
  'hamburger',
  'ngRoute',
  'covey.chat',
  'auth.services',
])
.config(($routeProvider) => {
  $routeProvider
    .when('/', {
      templateUrl: 'views/index.html',
      controller: 'indexController',
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
.run(function ($location, $rootScope, auth) {
  $rootScope.$on('$routeChangeStart', (event) => {
    auth.checkAuthentication()
      .then((isAuth) => {
        if (!isAuth) {
          event.preventDefault();
          $location.path('/');
        }
      })
      .catch(() => {
        event.preventDefault();
        $location.path('/');
      });
  });
});
