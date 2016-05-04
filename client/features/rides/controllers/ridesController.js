angular.module('covey.rides', [])
.controller('ridesController', function ($scope, ridesHelpers, ridesHttp) {
  // TODO: use factory function to GET rides details for covey_id (can access via $scope.details)
  $scope.rides = ridesHttp.getAllRides($scope.details.attendees);

  $scope.expandRide = false;

  $scope.expandRides = () => {
    $scope.expandRide = !$scope.expandRide;
  };

  $scope.getUsersCar = () => (
    ridesHelpers.getUsersCar($scope.rides, 'Skye Free')
  );

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
