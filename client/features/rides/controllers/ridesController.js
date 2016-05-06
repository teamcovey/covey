angular.module('covey.rides', [])
.controller('ridesController', function ($rootScope, $scope, ridesHelpers, ridesHttp) {
  // TODO: shared service for passing around user id... or put it on $rootScope
  const userId = 1;

  $scope.expandRide = false;
  $scope.ridesDetails = [];
  $scope.attendees = $rootScope.attendees;

  /* Gets all rides information for current covey,
  *  gets all riders for each ride,
  *  creates ridesDetails array with all rides and riders info,
  *  and sets user's current ride for display. */
  const init = () => {
    ridesHttp.getAllRides().then((rides) => {
      $scope.rides = rides;
      rides.forEach((ride) => {
        ridesHttp.getAllRiders(ride.id).then((riders) => {
          const result = ridesHelpers.findUsersRide(riders, ride, userId);
          // Sets user's current ride in the view:
          $scope.usersRide = result.usersRide;
          // Sets up cached ridesDetails object:
          $scope.ridesDetails.push({ ride, driver: result.driver, passengers: riders });
        });
      });
    });
  };

  init();

  /* Toggle edit mode visibility */
  $scope.expandRides = () => {
    $scope.expandRide = !$scope.expandRide;
  };

  /* Inserts placeholder for new supply for editing purposes */
  $scope.addNewRide = () => {
    const rideInput = ridesHelpers.newRideInput(userId);
    $scope.ridesDetails.push({
      ride: rideInput,
      driver: {},
      passengers: [],
    });
  };

  // TODO: add seats & location input boxes
  $scope.submitRide = (ride, rideIndex) => {
    /* uncomment once updateRide endpoint is created: */
    if (ride.id) {
      // ridesHttp.updateRide(ride).then((response) => {
      //   console.log('ride updated: ', response);
      // });
    } else {
      ridesHttp.addRide(ride).then((response) => {
        $scope.ridesDetails[rideIndex].ride.id = response.id;
      });
    }
    /* Sets user's current ride in the view: */
    $scope.usersRide = ridesHelpers.findUsersRide($scope.ridesDetails[rideIndex].passengers, $scope.ridesDetails[rideIndex].ride, userId).usersRide;
  };

  $scope.removeRide = (ride, rideIndex) => {
    if (!ride.id) {
      /* removes the empty placeholder ride */
      $scope.ridesDetails.pop();
    } else {
      ridesHttp.removeRide(ride.id).then(() => {
        $scope.ridesDetails.splice(rideIndex, 1);
        /* Sets user's current ride in the view: */
        $scope.usersRide = ridesHelpers.findUsersRide($scope.ridesDetails[rideIndex].passengers, $scope.ridesDetails[rideIndex].ride, userId).usersRide;
      });
    }
  };

  $scope.addPassenger = (passenger, ride) => {
    ridesHttp.addPassenger(ride.id, passenger.user_id)
      .then((newPassenger) => {
        /* Refresh ridesDetails with added passenger on success from db: */
        for (let i = 0; i < $scope.ridesDetails.length; i++) {
          if ($scope.ridesDetails[i].ride.id === ride.id) {
            $scope.ridesDetails[i].passengers.push(passenger);
            /* Sets user's current ride in the view: */
            $scope.usersRide = ridesHelpers.findUsersRide($scope.ridesDetails[i].passengers, $scope.ridesDetails[i].ride, userId).usersRide;
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
        /* Refresh all rides details */
        for (let i = 0; i < $scope.ridesDetails.length; i++) {
          if ($scope.ridesDetails[i].ride.id === ride.id) {
            $scope.ridesDetails[i].passengers.splice($scope.ridesDetails[i].passengers.indexOf(passenger), 1);
            /* Sets user's current ride in the view: */
            $scope.usersRide = ridesHelpers.findUsersRide($scope.ridesDetails[i].passengers, $scope.ridesDetails[i].ride, userId).usersRide;
          }
        }
      });
  };
});
