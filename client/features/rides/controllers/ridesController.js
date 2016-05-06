angular.module('covey.rides', [])
.controller('ridesController', function ($rootScope, $scope, ridesHelpers, ridesHttp) {
  // TODO: shared service for passing around user id... or put it on $rootScope
  const userId = 1;

  $scope.expandRide = false;
  $scope.ridesDetails = [];
  $scope.attendees = $rootScope.attendees;
  $scope.usersRide = 'You don\'t have a ride yet.';

  /* Gets all rides information for current covey,
  *  gets all riders for each ride,
  *  creates ridesDetails array with all rides and riders info,
  *  and sets user's current ride for display. */
  const init = () => {
    ridesHttp.getAllRides().then((returnedRiders) => {
      const totalRides = {};
      returnedRiders.forEach((returnedRider) => {
        if (returnedRider.user_id === userId) {
          if (returnedRider.isDriver) {
            $scope.usersRide = 'You\'re driving!';
          } else {
            $scope.usersRide = `You're riding with: ${returnedRider.name}`;
          }
        }
        // if current rider's ride is not yet on new totalRides object, add ride
        if (!totalRides[returnedRider.car_id]) {
          totalRides[returnedRider.car_id] = {
            ride: {
              id: returnedRider.car_id,
              name: returnedRider.name,
              covey_id: returnedRider.covey_id,
              coveyId: returnedRider.covey_id,
              seats: returnedRider.seats,
              location: returnedRider.location,
              departureTime: returnedRider.departureTime,
            },
            passengers: [{
              user_id: returnedRider.user_id,
              email: returnedRider.email,
              facebookId: returnedRider.facebookId,
              firstName: returnedRider.firstName,
              lastName: returnedRider.lastName,
              gender: returnedRider.gender,
              phoneNumber: returnedRider.phoneNumber,
              photoUrl: returnedRider.photoUrl,
              accessToken: returnedRider.accessToken,
              refreshToken: returnedRider.refreshToken,
            }],
          };
          $scope.ridesDetails.push(totalRides[returnedRider.car_id]);
        // otherwise, just add current rider as a passenger to current ride in totalRides object
        } else {
          totalRides[returnedRider.car_id].passengers.push({
            user_id: returnedRider.user_id,
            email: returnedRider.email,
            facebookId: returnedRider.facebookId,
            firstName: returnedRider.firstName,
            lastName: returnedRider.lastName,
            gender: returnedRider.gender,
            phoneNumber: returnedRider.phoneNumber,
            photoUrl: returnedRider.photoUrl,
            accessToken: returnedRider.accessToken,
            refreshToken: returnedRider.refreshToken,
          });
        }
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
      ridesHttp.updateRide(ride).then((response) => {
        console.log('ride updated: ', response);
      });
    } else {
      ridesHttp.addRide(ride).then((response) => {
        $scope.ridesDetails[rideIndex].ride.id = response.id;
        if ($scope.usersRide === 'You\'re not in a ride yet.') {
          $scope.usersRide = 'You\'re driving.';
        }
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
        /* Remove usersRide if they were a passenger in the removed ride: */
        $scope.usersRide = ridesHelpers.findUsersRide($scope.ridesDetails[rideIndex].passengers, $scope.ridesDetails[rideIndex].ride, userId, true).usersRide;
        $scope.ridesDetails.splice(rideIndex, 1);
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
            /* Add usersRide if they were a passenger in the added ride: */
            if (passenger.user_id === userId) {
              $scope.usersRide += ride.name;
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
