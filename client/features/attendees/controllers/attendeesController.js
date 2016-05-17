angular.module('covey.attendees', ['friends.services'])
.controller('attendeesController', function ($rootScope, $scope, attendeesHttp, friendsFactory, profileService) {
  $scope.newAttendee = '';

  /* Render view with all attendees for current covey
   * and all friends for current user */
  const init = () => {
    attendeesHttp.getAllAttendees().then((attendees) => {
      $scope.attendees = attendees;
    });

    friendsFactory.getFriends()
      .then((friends) => {
        $scope.friends = friends.data;
      });
  };

  init();

  $scope.addAttendee = (newAttendee) => {
    attendeesHttp.addAttendee(newAttendee.id).then((response) => {
      if (!response.user.user_id) {
        response.user.user_id = response.user.id;
      }
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
