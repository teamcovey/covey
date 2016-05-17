angular.module('coveys')

.directive('coveysDirective', () => {
  return {
    templateUrl: 'features/coveys/views/mycoveys.html',
  };
})
.directive('friendsDirective', () => {
  return {
    templateUrl: 'features/friends/views/myfriends.html',
    controller: 'friendsController',
  };
});
