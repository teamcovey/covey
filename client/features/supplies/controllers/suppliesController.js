angular.module('covey.supplies', [])
.controller('suppliesController', function ($scope, $rootScope, suppliesHelpers, suppliesHttp) {
  // TODO: logged in userId will be set by some shared Auth service
  const userId = 2;

  $scope.expandSupply = false;
  $scope.supplyDetails = [];
  $scope.usersSupplies = '';
  $scope.attendees = $rootScope.attendees;

  /* Gets all supplies information for current covey,
  *  gets all suppliers for each supply,
  *  creates suppliesDetails array with all supplies and supplies info,
  *  and sets user's supplies responsibilities as well. */
  suppliesHttp.getAllSupplies()
    .then((supplies) => {
      $scope.supplies = supplies;
      supplies.forEach((supply) => {
        suppliesHttp.getAllSuppliers(supply.id).then((suppliers) => {
          suppliers.forEach((supplier) => {
            if (supplier.user_id === userId) {
              $scope.usersSupplies += supply.name;
            }
          });
          $scope.supplyDetails.push({ supply, suppliers });
        });
      });
    });

  /* Modal to toggle edit mode visibility */
  $scope.expandSupplies = () => {
    $scope.expandSupply = !$scope.expandSupply;
  };

  /* Inserts placeholder for new supply for editing purposes */
  $scope.addNewSupply = () => {
    const supplyInput = suppliesHelpers.newSupplyInput();
    $scope.supplyDetails.push({
      supply: supplyInput,
      suppliers: [],
    });
  };

  /* Creates or updates a supply when users selects 'Update' in edit view */
  $scope.submitSupply = (supply) => {
    console.log('SUPPLY TO ADD: ', supply);
    if (supply.id) {
      console.log('UPDATED SUPPLY: ', supply);
      // suppliesHttp.updateSupply(supply).then((response) => {
      //   console.log('supply updated: ', response);
      // });
    } else {
      suppliesHttp.addSupply(supply).then((response) => {
        console.log('supply created: ', response);
      });
    }
  };

  $scope.deleteSupply = (supply) => {
    suppliesHttp.removeSupply(supply.id);
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
    return attendees.filter((attendee) => {
      let result = true;
      suppliers.forEach((currentSupplier) => {
        if (currentSupplier.user_id === attendee.user_id) {
          result = false;
        }
      });
      return result;
    });
  };
});
