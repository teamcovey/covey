angular.module('covey.covey', [])

.controller('coveyController', function ($scope) {
  /* Get Logged In User */
  // TODO: user id from local storage set on login
  $scope.user = 'Skye Free';
  $scope.testUser = () => {
    const size = $scope.testingUser.length;
    if (size > 6) {
      $scope.grade = 'strong';
    } else {
      $scope.grade = 'weak';
    }
  };

  /* Covey Logic */
  // on /covey load, use factory GET request for covey table events details
  $scope.details = {
    id: 1,
    eventName: 'Camping With Friends',
    time: '6PM',
    location: 'Yosemite, CA',
    attendees: ['Freddie Ryder', 'Rahim Dharssi', 'Toben Green', 'Skye Free'],
  };

  $scope.updateCovey = () => {
    console.log($scope.details);
    // make PUT request to update covey event details
  };
})
.directive('coveyDetails', () => (
  {
    templateUrl: 'views/coveyDetails.html',
  }
))
.directive('coveyAttendees', () => (
  {
    templateUrl: 'views/coveyAttendees.html',
    controller: 'attendeesController',
  }
))
.directive('rides', () => (
  {
    templateUrl: 'views/rides.html',
    controller: 'ridesController',
  }
))
.directive('supplies', () => (
  {
    templateUrl: 'views/supplies.html',
    controller: 'suppliesController',
  }
));
