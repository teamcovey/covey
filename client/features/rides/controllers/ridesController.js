angular.module('covey.rides', [])
.controller('ridesController', function ($rootScope, $scope, ridesHelpers, ridesHttp) {
  // TODO: shared service for passing around user id... or put it on $rootScope
  const userId = 1;
  $scope.ridesDetails = [];
  $scope.attendees = $rootScope.attendees;

  // TODO: change getAllRides endpoint to attatch passengers array to each rides object
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
        console.log($scope.ridesDetails);
      });
    });
  });

  $scope.expandRide = false;

  $scope.expandRides = () => {
    $scope.expandRide = !$scope.expandRide;
  };

  $scope.addNewRide = () => {
    $scope.rides.push({
      id: $scope.rides.length + 1,
      covey_id: 1,
      driverName: 'driver',
      timeToLeave: 'when',
      passengers: [],
    });
    // ridesHttp.post({})
  };

  $scope.checkPassenger = (driver) => (
    ridesHelpers.checkPassenger(driver, $scope.rides)
  );

  $scope.submitRide = (ride) => {
    const isPassenger = $scope.checkPassenger(ride.driverName);
    if (isPassenger !== null) $scope.removePassenger(ride.driverName, { id: isPassenger });

    $scope.rides[ride.id - 1] = {
      id: ride.id,
      covey_id: 1,
      driverName: ride.driverName,
      timeToLeave: ride.timeToLeave,
      passengers: ride.passengers,
    };

    // ridesHttp.put({})
  };

  $scope.deleteRide = (ride) => {
    $scope.rides.splice(ride.id - 1, 1);
    // make PUT or DEL request to update supply
    $scope.rides.forEach((currentRide, index) => {
      currentRide.id = index + 1;
    });
  };

  $scope.addPassenger = (passenger, ride) => {
    $scope.rides[ride.id - 1].passengers.push(passenger);
    // ridesHttp.addPassenger({})
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
