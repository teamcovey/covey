angular.module('covey.covey')
.directive('sideNav', () => (
  {
    templateUrl: function (elem, attr) {
      return 'features/navbar/views/nav' + attr.type + 'View.html';
    },
    controller: 'navController',
  }
))
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
))
.directive('expenses', () => (
  {
    templateUrl: 'features/expenses/views/expensesView.html',
    controller: 'expensesController',
  }
));
