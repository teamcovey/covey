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

  const removeFromAttendees = (friend) => {
    $scope.details.attendees.forEach((attendee, index) => {
      if (attendee === friend) {
        $scope.details.attendees.splice(index, 1);
      }
    });
  };

  const removeFromPassengers = (friend) => {
    const isPassenger = $scope.checkPassenger(friend);
    if (isPassenger !== null) $scope.removePassenger(friend, { id: isPassenger });
  };

  const removeFromSuppliers = (friend) => {
    $scope.supplies.supplies.forEach((supply) => {
      supply.suppliers.forEach((supplier, index) => {
        if (supplier === friend) {
          supply.suppliers.splice(index, 1);
        }
      });
    });
  };

  $scope.removeFriend = (friend) => {
    removeFromAttendees(friend);
    removeFromPassengers(friend);
    removeFromSuppliers(friend);
  };
});
