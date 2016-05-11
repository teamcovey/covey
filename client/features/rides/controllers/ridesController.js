angular.module('covey.rides', ['userId.services', 'covey.attendees'])
.controller('ridesController', function ($rootScope, $scope, ridesHelpers, ridesHttp, userIdFactory, attendeesHttp) {
  const userId = userIdFactory.getUserId();
  $scope.expandRide = false;
  $scope.ridesDetails = [];
  $scope.usersRide = 'You don\'t have a ride yet.';

  /* Gets all attendees of this event */
  // TODO: trigger this call when attendeesCtrl changes
  attendeesHttp.getAllAttendees()
    .then((response) => {
      $scope.attendees = response;
    });

  /* Gets all rides (& riders) info for current covey,
  *  and sets logged-in user's current ride for display. */
  const init = () => {
    ridesHttp.getAllRides()
      .then((rides) => {
        $scope.ridesDetails = rides;
        $scope.usersRide = ridesHelpers.getUsersRide(rides, userId);
      });
  };

  init();

  /* Displays user's current ride */
  $scope.stringifyUsersRide = () => {
    return $scope.usersRide.name;
  };

  /* Toggle edit mode visibility */
  $scope.expandRides = () => {
    $scope.expandRide = !$scope.expandRide;
  };

  /* Inserts placeholder for new supply for editing purposes */
  $scope.addNewRide = () => {
    $scope.ridesDetails.push(ridesHelpers.newRideInput());
  };

  /* Creates or updates a ride when user select 'Update' in edit view */
  $scope.submitRide = (ride, rideIndex) => {
    if (ride.id) {
      ridesHttp.updateRide(ride).then((response) => {
        console.log('ride updated: ', response);
      });
    } else {
      ridesHttp.addRide(ride).then((response) => {
        $scope.ridesDetails[rideIndex].id = response.id;
      });
    }
  };

  $scope.removeRide = (ride, rideIndex) => {
    if (!ride.id) {
      /* removes the empty placeholder ride */
      $scope.ridesDetails.pop();
    } else {
      ridesHttp.removeRide(ride.id).then(() => {
        $scope.ridesDetails.splice(rideIndex, 1);
      });
    }
  };

  $scope.addPassenger = (passenger, ride) => {
    ridesHttp.addPassenger(ride.id, passenger.user_id)
      .then((newPassenger) => {
        /* Refresh ridesDetails with added passenger on success from db: */
        for (let i = 0; i < $scope.ridesDetails.length; i++) {
          if ($scope.ridesDetails[i].id === ride.id) {
            $scope.ridesDetails[i].riders.push(passenger);
            /* Add usersRide if they were a passenger in the added ride: */
            if (passenger.user_id.toString() === userId.toString()) {
              $scope.usersRide = ridesHelpers.getUsersRide($scope.ridesDetails, userId);
            }
          }
        }
        console.log('Added new passenger: ', newPassenger);
      }, (error) => {
        console.error(error);
      });
  };

  $scope.removePassenger = (passenger, ride) => {
    ridesHttp.removePassenger(ride.id, passenger.user_id)
      .then(() => {
        /* Refresh ridesDetails */
        for (let i = 0; i < $scope.ridesDetails.length; i++) {
          if ($scope.ridesDetails[i].id === ride.id) {
            /* If current user is the removed rider, remove ride from user's ride assignment */
            if (passenger.user_id.toString() === userId.toString()) {
              $scope.usersRide = { name: 'none.'};
            }
            $scope.ridesDetails[i].riders.splice($scope.ridesDetails[i].riders.indexOf(passenger), 1);
          }
        }
      });
  };
});
