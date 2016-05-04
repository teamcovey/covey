angular.module('covey.supplies', [])
.controller('suppliesController', function ($scope, suppliesHelpers, suppliesHttp) {
  const coveyId = 1;

  $scope.expandSupply = false;

  $scope.supplies = suppliesHttp.getAllSupplies(coveyId, $scope.details.attendees);

  $scope.getUsersResponsibilities = () => (
    suppliesHelpers.getUsersSupplies($scope.supplies.supplies, $scope.user)
  );

  $scope.addNewSupply = () => {
    $scope.supplies.push({
      id: $scope.supplies.supplies.length + 1,
      covey_id: 1,
      supplyName: 'supply',
      suppliers: [],
    });
  };

  $scope.expandSupplies = () => {
    $scope.expandSupply = !$scope.expandSupply;
  };

  $scope.submitSupply = (supply) => {
    suppliesHttp.addSupply({
      covey_id: coveyId,
      supplyName: supply.supplyName,
      suppliers: supply.suppliers,
    });
  };

  $scope.deleteSupply = (supply) => {
    suppliesHttp.removeSupply(supply.id);
    // $scope.supplies.supplies.splice(supply.id - 1, 1);
    // // make PUT or DEL request to update supply
    // $scope.supplies.supplies.forEach((currentSupply, index) => {
    //   currentSupply.id = index + 1;
    // });
  };

  $scope.addSupplier = (supplier, supply) => {
    suppliesHttp.addSupplier(supply.id, supplier);
    // $scope.supplies.supplies[supply.id - 1].suppliers.push(supplier);
  };

  $scope.removeSupplier = (supplier, supply) => {
    suppliesHttp.removeSupplier(supply.id, supplier);
    // $scope.supplies.supplies[supply.id - 1].suppliers.forEach((currentSupplier, index) => {
    //   if (currentSupplier === supplier) {
    //     $scope.supplies.supplies[supply.id - 1].suppliers.splice(index, 1);
    //   }
    // });
  };
})
.filter('alreadySupplier', function () {
  return (attendees, suppliers) => {
    return attendees.filter((supplier) => (
      suppliers.indexOf(supplier) === -1
    ));
  };
});
