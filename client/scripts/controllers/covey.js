angular.module('covey.covey', [])

.controller('coveyController', function ($scope) {
  /* Get Logged In User */
  // TODO: user id from local storage set on login
  $scope.user = 'Skye';

  /* Covey Logic */
  // on /covey load, use factory GET request for covey table events details
  $scope.details = {
    id: 1,
    eventName: 'Camping With Friends',
    time: '6PM',
    location: 'Yosemite, CA',
    attendees: ['Freddie', 'Rahim', 'Toben', 'Skye'],
  };
  $scope.friends = $scope.details.attendees.join(', ');

  // and GET rides table details for covey_id
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

  // and GET supplies table details for covey_id
  $scope.supplies = {
    supplies: [
      {
        id: 1, covey_id: 1, supplyName: 'Beer', suppliers: ['Rahim', 'Freddie'],
      },
      {
        id: 2, covey_id: 1, supplyName: 'Chips', suppliers: ['Toben', 'Skye'],
      },
    ],
  };

  $scope.expandRide = false;
  $scope.expandSupply = false;

  $scope.addNewRide = () => {
    $scope.rides.rides.push({
      id: $scope.rides.rides.length + 1,
      covey_id: 1,
      driverName: 'add new driver...',
      timeToLeave: 'time...',
      passengers: 'passengers...',
    });
  };

  $scope.addNewSupply = () => {
    $scope.supplies.supplies.push({
      id: $scope.supplies.supplies.length + 1,
      covey_id: 1,
      supplyName: 'add new supply...',
      suppliers: 'contributors...',
    });
  };

  $scope.expandRides = () => {
    $scope.expandRide = !$scope.expandRide;
  };

  $scope.expandSupplies = () => {
    $scope.expandSupply = !$scope.expandSupply;
  };

  $scope.submitRide = (ride) => {
    console.log(ride);
    // make PUT or POST request to add/update ride
  };

  $scope.submitSupply = (supply) => {
    console.log(supply);
    // make PUT or POST request to add/update supply
  };

  $scope.updateCovey = () => {
    console.log($scope.details);
    // make PUT request to update covey event details
  };

  $scope.deleteSupply = (supply) => {
    $scope.supplies.supplies.splice(supply.id - 1, 1);
    // make PUT or DEL request to update supply
  };

  $scope.deleteRide = (ride) => {
    $scope.rides.rides.splice(ride.id - 1, 1);
    // make PUT or DEL request to update ride
  };
})
.directive('coveyDetails', () => (
  {
    templateUrl: 'views/coveyDetails.html',
  }
))
.directive('rides', () => (
  {
    templateUrl: 'views/rides.html',
  }
))
.directive('supplies', () => (
  {
    templateUrl: 'views/supplies.html',
  }
));
