angular.module('covey.covey', [])

.controller('coveyController', function($scope) {
  $scope.covey = "cheetah petting zoo";
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
  }

  $scope.expandSupplies = () => {
    $scope.expandSupply = !$scope.expandSupply;
  }

  $scope.addSupply = () => {
    $scope.supplies.push('');
  };

  $scope.addNewSupply = (supply) => {
    $scope.supplies[$scope.supplies.length - 1] = supply;
  };
});
