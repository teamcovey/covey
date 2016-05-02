angular.module('covey.attendees', [])
.controller('attendeesController', function ($scope) {
  $scope.newFriend = '';

  $scope.addFriend = (newFriend) => {
    const friendsToAdd = newFriend.split(',');
    friendsToAdd.forEach((friend) => {
      $scope.details.attendees.push(friend);
    });
    $scope.newFriend = '';
  };

  $scope.removeFriend = (friend) => {
    $scope.details.attendees.forEach((attendee, index) => {
      if (attendee === friend) {
        $scope.details.attendees.splice(index, 1);
      }
    });
  };
});
