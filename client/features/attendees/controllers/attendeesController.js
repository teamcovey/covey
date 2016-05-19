angular.module('covey.attendees', ['friends.services'])
.controller('attendeesController', function ($rootScope, $scope, attendeesHttp, friendsFactory, profileService) {
  $scope.newAttendee = '';

  /* Render view with all attendees for current covey
   * and all friends for current user */
  const init = () => {
    attendeesHttp.getAllAttendees().then((attendees) => {
      $scope.attendees = attendees;
      friendsFactory.getFriends()
        .then((friends) => {
          // Remove friends that are already in attendees
          for (var i = 0; i < friends.data.length; i++) {
            for (var j = 0; j < $scope.attendees.length; j++) {
              if (friends.data[i].userId === attendees[j].userId) {
                friends.data.splice(i, 1);
                i--;
              }
            }
          }
          $scope.friends = friends.data;
        });
    });

  };

  init();

  $scope.addAttendee = (newAttendee) => {
    attendeesHttp.addAttendee(newAttendee.userId).then((response) => {
      $scope.attendees.push(response.user);
    });
    $scope.friends.splice($scope.friends.indexOf(newAttendee), 1);
    $scope.newAttendee = '';
  };

  $scope.removeAttendee = (attendee) => {
    attendeesHttp.removeAttendee(attendee.userId)
      .then((response) => {
        console.log('Removed Attendee id: ', attendee.userId);
        $scope.attendees.splice($scope.attendees.indexOf(attendee), 1);
      }, (error) => {
        console.error(error);
      });
    $scope.friends.push(attendee);
  };
});
