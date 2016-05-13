angular.module('covey.welcome')

.directive('welcomeDirective', () => {
  return {
    templateUrl: 'features/welcome/views/welcome.html',
    controller: 'welcomeController',
  };
});
