angular.module('covey', [
  'covey.index',
  'index.services',
  'covey.welcome',
  'covey.attendees',
  'covey.supplies',
  'covey.rides',
  'covey.covey',
  'welcome.services',
  'covey.services',
  'userId.services',
  'date.services',
  'ngCookies',
  'auth.controller',
  'createCovey',
  'coveys',
  'friends',
  'profile',
  'hamburger',
  'ngRoute',
  'covey.chat',
  'auth.services',
  'btford.socket-io',
  'calendar.services',
])
.config(($routeProvider) => {
  $routeProvider
    .when('/', {
      templateUrl: 'features/index/views/index.html',
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
    .when('/profile', {
      templateUrl: 'features/profile/views/profile.html',
    })
    .otherwise({
      redirectTo: '/',
    });
})
.run(function ($location, $rootScope, auth) {
  $rootScope.$on('$routeChangeStart', (event) => {
    if ($location.path() !== '/about') {
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
    }
  });
});
