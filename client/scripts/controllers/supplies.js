angular.module('covey.supplies', [])
.controller('suppliesController', function ($scope) {
  // TODO: GET supplies table details for covey_id (can access to covey $scope.details)
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

  $scope.expandSupply = false;

  $scope.addNewSupply = () => {
    $scope.supplies.supplies.push({
      id: $scope.supplies.supplies.length + 1,
      covey_id: 1,
      supplyName: 'add new supply...',
      suppliers: 'contributors...',
    });
  };

  $scope.expandSupplies = () => {
    $scope.expandSupply = !$scope.expandSupply;
  };

  $scope.submitSupply = (supply) => {
    console.log(supply);
    // make PUT or POST request to add/update supply
  };

  $scope.deleteSupply = (supply) => {
    $scope.supplies.supplies.splice(supply.id - 1, 1);
    // make PUT or DEL request to update supply
  };
});
