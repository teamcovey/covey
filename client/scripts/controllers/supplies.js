angular.module('covey.supplies', [])
.filter('alreadySupplier', function () {
  return (attendees, suppliers) => {
    return attendees.filter((supplier) => (
      suppliers.indexOf(supplier) === -1
    ));
  };
})
.controller('suppliesController', function ($scope) {
  // TODO: GET supplies table details for covey_id (can access to covey $scope.details)
  $scope.supplies = {
    supplies: [
      {
        id: 1, covey_id: 1, supplyName: 'Beer', suppliers: [$scope.details.attendees[2], $scope.details.attendees[0]],
      },
      {
        id: 2, covey_id: 1, supplyName: 'Chips', suppliers: [$scope.details.attendees[2]],
      },
    ],
  };

  $scope.expandSupply = false;

  $scope.getUsersResponsibilities = () => {
    const supplies = $scope.supplies.supplies;
    let responsibilities = '';
    for (let i = 0; i < supplies.length; i++) {
      if (supplies[i].suppliers.indexOf($scope.user) > -1) {
        responsibilities += `${supplies[i].supplyName}, `;
      }
    }
    return responsibilities.slice(0, -2);
  };

  $scope.addNewSupply = () => {
    $scope.supplies.supplies.push({
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
    // make PUT or POST request to add/update supply
    $scope.supplies.supplies[supply.id - 1] = {
      id: supply.id,
      covey_id: 1,
      supplyName: supply.supplyName,
      suppliers: supply.suppliers,
    };
  };

  $scope.deleteSupply = (supply) => {
    $scope.supplies.supplies.splice(supply.id - 1, 1);
    // make PUT or DEL request to update supply
    $scope.supplies.supplies.forEach((currentSupply, index) => {
      currentSupply.id = index + 1;
    });
  };

  $scope.addSupplier = (supplier, supply) => {
    $scope.supplies.supplies[supply.id - 1].suppliers.push(supplier);
  };

  $scope.removeSupplier = (supplier, supply) => {
    $scope.supplies.supplies[supply.id - 1].suppliers.forEach((currentSupplier, index) => {
      if (currentSupplier === supplier) {
        $scope.supplies.supplies[supply.id - 1].suppliers.splice(index, 1);
      }
    });
  };
});
