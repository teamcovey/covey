angular.module('covey.covey')
.directive('coveyDetails', () => (
  {
    templateUrl: 'features/covey/views/detailsView.html',
  }
))
.directive('coveyAttendees', () => (
  {
    templateUrl: 'features/attendees/views/attendeesView.html',
    controller: 'attendeesController',
  }
))
.directive('rides', () => (
  {
    templateUrl: 'features/rides/views/ridesView.html',
    controller: 'ridesController',
  }
))
.directive('supplies', () => (
  {
    templateUrl: 'features/supplies/views/suppliesView.html',
    controller: 'suppliesController',
  }
))
.directive('chat', () => (
  {
    templateUrl: 'features/chat/views/chatView.html',
    controller: 'chatController',
  }
));
