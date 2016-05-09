angular.module('welcome')

.directive('welcomeDirective', () => {
  return {
    templateUrl: 'features/welcome/views/welcome.html',
  };
});
