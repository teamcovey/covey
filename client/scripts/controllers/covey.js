angular.module('covey.covey', [])

.controller('coveyController', function ($scope) {
  /* Get Logged In User */
  $scope.user = 'Skye';
  
  /* Covey Logic */
  // on /covey load, use factory GET request for covey table events details
  $scope.details = {
    "id": 1, "eventName": "Camping With Friends", "time": "6PM", "location": "Yosemite, CA", "attendees": ["Freddie", "Rahim", "Toben", "Skye"] 
  };
  $scope.friends = $scope.details.attendees.join(', ');

  // and GET rides table details for covey_id
  $scope.rides = {
    "rides": {
      1: {
        "id": 1, "covey_id": 1, "driverName": "Rahim", "timeToLeave": "3PM", 
        "passengers": ["Friend1", "Friend2"]
      },
      2: {
        "id": 2, "covey_id": 1, "driverName": "Freddie", "timeToLeave": "3PM", 
        "passengers": ["Skye", "Toben"]
      },
    },
  };

  // and GET supplies table details for covey_id
  $scope.supplies = {
    "supplies": {
      1: {
        "id": 1, "covey_id": 1, "supplyName": "Beer", "suppliers": ["Rahim", "Freddie"]
      },
    },
  };

  $scope.cars = ['skye'];
  $scope.supplies = ['chips'];
  $scope.expandRide = false;
  $scope.expandSupply = false;

  $scope.addCar = () => {
    $scope.cars.push('');
  };

  $scope.addNewCar = (car) => {
    $scope.cars[$scope.cars.length - 1] = car;
  };

  $scope.expandRides = () => {
    $scope.expandRide = !$scope.expandRide;
  };

  $scope.expandSupplies = () => {
    $scope.expandSupply = !$scope.expandSupply;
  };

  $scope.addSupply = () => {
    $scope.supplies.push('');
  };

  $scope.addNewSupply = (supply) => {
    $scope.supplies[$scope.supplies.length - 1] = supply;
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
