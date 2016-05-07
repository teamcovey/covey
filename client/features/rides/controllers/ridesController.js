angular.module('covey.rides', [])
.controller('ridesController', function ($rootScope, $scope, ridesHelpers, ridesHttp) {
  // TODO: shared service for passing around user id... or put it on $rootScope
  const userId = 1;

  $scope.expandRide = false;
  $scope.ridesDetails = [];
  $scope.attendees = $rootScope.attendees;
  $scope.usersRide = 'You don\'t have a ride yet.';

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
            if (passenger.user_id === userId) {
              // TODO: update $scope.usersRide
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
            $scope.ridesDetails[i].splice($scope.ridesDetails[i].rides.indexOf(passenger), 1);
            /* If current user is the removed rider, remove ride from user's ride assignment */
            if (passenger.user_id === userId) {
              $scope.usersRide = 'You don\'t have a ride.';
            }
          }
        }
      });
  };
});
