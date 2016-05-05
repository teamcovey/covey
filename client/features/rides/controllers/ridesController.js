angular.module('covey.rides', [])
.controller('ridesController', function ($rootScope, $scope, ridesHelpers, ridesHttp) {
  // TODO: shared service for passing around user id... or put it on $rootScope
  const userId = 1;
  $scope.ridesDetails = [];
  $scope.attendees = $rootScope.attendees;

  // TODO: change getAllRides endpoint to attatch passengers array to each rides object
  /* Gets all supplies information for current covey,
  *  gets all suppliers for each supply,
  *  creates suppliesDetails array with all supplies and supplies info,
  *  and sets user's supplies responsibilities as well. */
  ridesHttp.getAllRides().then((rides) => {
    $scope.rides = rides;
    rides.forEach((ride) => {
      ridesHttp.getAllRiders(ride.id).then((riders) => {
        let driver;
        riders.forEach((rider) => {
          if (rider.isDriver) {
            driver = rider;
          }
          if (rider.id === userId) {
            $scope.usersRide = `Your riding with: ${ride.name}`;
          }
        });
        $scope.ridesDetails.push({ ride, driver, passengers: riders });
      });
    });
  });

  $scope.expandRide = false;

  $scope.expandRides = () => {
    $scope.expandRide = !$scope.expandRide;
  };

  $scope.addNewRide = () => {
    $scope.ridesDetails.push({
      ride: {
        name: 'add ride',
        departureTime: 'when to leave',
      },
      driver: {},
      passengers: [],
    });
  };

  $scope.checkPassenger = (driver) => (
    ridesHelpers.checkPassenger(driver, $scope.rides)
  );

  // BUG FIX: for some reason, when submitting a new ride with frodo's id
  // it added frodo as a passenger to the other car
  $scope.submitRide = (ride) => {
    // const isPassenger = $scope.checkPassenger(ride.driverName);
    // if (isPassenger !== null) $scope.removePassenger(ride.driverName, { id: isPassenger });

    // PUT vs POST (PUT REQUIRES ID)
    // TODO: add seats & location input boxes
    const rideToAdd = {
      userId: 2,
      departureTime: ride.departureTime,
      location: 'Bree',
      name: ride.name,
      seats: 4,
    };

    if (ride.id) {
      rideToAdd.id = ride.id;
      ridesHttp.put(rideToAdd);
    } else {
      ridesHttp.addRide(rideToAdd);
    }
  };

  // TODO: once passenger is add, immediately update the view or rides.ridesDetails
  $scope.addPassenger = (passenger, ride) => {
    ridesHttp.addPassenger(ride.id, passenger.user_id);
  };


  // FOLLOWING TO BE REPLACED: ///////////////////////////////////
  $scope.deleteRide = (ride) => {
    $scope.rides.splice(ride.id - 1, 1);
    // make PUT or DEL request to update supply
    $scope.rides.forEach((currentRide, index) => {
      currentRide.id = index + 1;
    });
  };

  $scope.removePassenger = (passenger, ride) => {
    $scope.rides[ride.id - 1].passengers.forEach((currentPassenger, index) => {
      if (currentPassenger === passenger) {
        $scope.rides[ride.id - 1].passengers.splice(index, 1);
      }
    });
    // ridesHttp.deletePassenger({})
  };
});
