angular.module('covey.rides', [])
.controller('ridesController', function ($scope) {
  // TODO: GET rides table details for covey_id (can access to covey $scope.details)
  $scope.rides = {
    rides: [
      {
        id: 1, covey_id: 1, driverName: 'Rahim', timeToLeave: '3PM',
        passengers: ['Friend1', 'Friend2'],
      },
      {
        id: 2, covey_id: 1, driverName: 'Freddie', timeToLeave: '3PM',
        passengers: ['Skye', 'Toben'],
      },
    ],
  };

  $scope.expandRide = false;
  $scope.addNewRide = () => {
    $scope.rides.rides.push({
      id: $scope.rides.rides.length + 1,
      covey_id: 1,
      driverName: 'add new driver...',
      timeToLeave: 'time...',
      passengers: 'passengers...',
    });
  };
  $scope.expandRides = () => {
    $scope.expandRide = !$scope.expandRide;
  };

  $scope.submitRide = (ride) => {
    console.log(ride);
    // make PUT or POST request to add/update ride
  };

  $scope.deleteRide = (ride) => {
    $scope.rides.rides.splice(ride.id - 1, 1);
    // make PUT or DEL request to update supply
  };
});
