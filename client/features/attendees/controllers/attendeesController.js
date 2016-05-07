angular.module('covey.attendees', [])
.controller('attendeesController', function ($rootScope, $scope, attendeesHttp) {
  $scope.newAttendee = '';

  /* Render view with all attendees for current covey */
  const init = () => {
    attendeesHttp.getAllAttendees().then((attendees) => {
      $scope.attendees = attendees;
    });
  };

  init();

  $scope.addAttendee = (newAttendeeId) => {
    attendeesHttp.addAttendee(newAttendeeId).then((response) => {
      if (!response.user.user_id) {
        response.user.user_id = response.user.id;
      }
      console.log('Added attendee id: ', response.user.user_id);
      $scope.attendees.push(response.user);
    });
    $scope.newAttendee = '';
  };

  $scope.removeAttendee = (attendee) => {
    attendeesHttp.removeAttendee(attendee.user_id)
      .then((response) => {
        console.log('Removed Attendee id: ', attendee.user_id);
        $scope.attendees.splice($scope.attendees.indexOf(attendee), 1);
      }, (error) => {
        console.error(error);
      });
  };
});
