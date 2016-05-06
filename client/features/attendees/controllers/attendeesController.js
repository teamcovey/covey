angular.module('covey.attendees', [])
.controller('attendeesController', function ($rootScope, $scope, attendeesHelpers, attendeesHttp) {
  $scope.newAttendee = '';

  /* Render view with all attendees for current covey */
  const init = () => {
    attendeesHttp.getAllAttendees().then((attendees) => {
      $scope.attendees = attendees;

      /* Set attendees to rootScope so other controllers have access */
      $rootScope.attendees = $scope.attendees;
    });
  };

  init();

  $scope.addAttendee = (newAttendeeId) => {
    attendeesHttp.addAttendee(newAttendeeId).then((response) => {
      console.log('Add attendee: ', response);
      //TODO: instead of init, just add response to scope.attendees
      init();
    });
    $scope.newAttendee = '';
  };

  $scope.removeAttendee = (attendee) => {
    attendeesHttp.removeAttendee(attendee.user_id)
      .then((response) => {
        console.log('Removed attendee: ', attendee);
        init();
      }, (error) => {
        console.error(error);
      });
  };
});
