angular.module('covey.supplies', [])
.controller('suppliesController', function ($scope, $rootScope, suppliesHelpers, suppliesHttp) {
  // TODO: logged in userId will be set by some shared Auth service
  const userId = 2;

  $scope.expandSupply = false;
  $scope.supplyDetails = [];
  $scope.usersSupplies = '';
  $scope.attendees = $rootScope.attendees;

  /* Get all supplies (& supppliers) info for current covey,
  *  and display logged-in user's assigned supplies as well. */
  const init = () => {
    suppliesHttp.getAllSupplies()
      .then((supplies) => {
        $scope.supplyDetails = supplies;
        $scope.usersSupplies = suppliesHelpers.getUsersSupplies(supplies, 5); // CHANGE TO userId when data is live
      });
  };

  init();

  /* Turn logged-in user's assigned supplies into a string for displaying */
  $scope.reduceUsersSupplies = () => {
    return suppliesHelpers.suppliesToString($scope.usersSupplies);
  };

  /* Toggle edit mode visibility */
  $scope.expandSupplies = () => {
    $scope.expandSupply = !$scope.expandSupply;
  };

  /* Inserts placeholder for new supply for editing purposes */
  $scope.addNewSupply = () => {
    $scope.supplyDetails.push(suppliesHelpers.newSupplyInput());
  };

  /* Creates or updates a supply when users selects 'Update' in edit view */
  $scope.submitSupply = (supply, supplyIndex) => {
    if (supply.id) {
      suppliesHttp.updateSupply(supply).then((response) => {
        console.log('supply updated: ', response);
        // TODO: update that name for user display too...
        // const currentSupplyName = suppliesHelpers.findUsersSupplies($scope.supplyDetails[supplyIndex].suppliers, supply, userId);
        // if (currentSupplyName !== 'no supplies.') {
        //   const currentUsersSupplies = $scope.usersSupplies;
        //   const startIndex = currentUsersSupplies.indexOf(currentSupplyName);
        //   const endIndex = startIndex + currentSupplyName.length + 2;
        //   $scope.usersSupplies = currentUsersSupplies.slice(0, startIndex) + currentUsersSupplies.slice(endIndex, currentUsersSupplies.length) + currentSupplyName + ', ';
        // }
      });
    } else {
      suppliesHttp.addSupply(supply).then((response) => {
        $scope.supplyDetails[supplyIndex].id = response.resource.id;
      });
    }
  };

  $scope.removeSupply = (supply, supplyIndex) => {
    if (!supply.id) {
      /* removes the empty placeholder supply */
      $scope.supplyDetails.pop();
    } else {
      suppliesHttp.removeSupply(supply.id).then(() => {
        /* Remove usersRide if they were a passenger in the removed ride: */
        const currentSupplyName = suppliesHelpers.findUsersSupplies($scope.supplyDetails[supplyIndex].suppliers, supply, userId);
        if (currentSupplyName !== 'no supplies.') {
          const currentUsersSupplies = $scope.usersSupplies;
          const startIndex = currentUsersSupplies.indexOf(currentSupplyName);
          const endIndex = startIndex + currentSupplyName.length + 2;
          $scope.usersSupplies = currentUsersSupplies.slice(0, startIndex) + currentUsersSupplies.slice(endIndex, currentUsersSupplies.length);
        }
        $scope.supplyDetails.splice(supplyIndex, 1);
      });
    }
  };

  $scope.addSupplier = (supplier, supply) => {
    suppliesHttp.addSupplier(supply.id, supplier.user_id)
    .then((newSupplier) => {
      /* Refresh supplyDetails with added supplier on success from db: */
      for (let i = 0; i < $scope.supplyDetails.length; i++) {
        if ($scope.supplyDetails[i].supply.id === supply.id) {
          $scope.supplyDetails[i].suppliers.push(supplier);
          /* Sets user's current supply in the view: */
          if ($scope.usersSupplies === 'no supplies, ') {
            $scope.usersSupplies = '';
          }
          if (supplier.user_id === userId) {
            $scope.usersSupplies += `${suppliesHelpers.findUsersSupplies($scope.supplyDetails[i].suppliers, $scope.supplyDetails[i].supply, userId)}, `;
          }
        }
      }
    }, (error) => {
      console.error(error);
    });
  };

  $scope.removeSupplier = (supplier, supply) => {
    suppliesHttp.removeSupplier(supply.id, supplier.user_id)
    .then((removedSupplier) => {
      /* Refresh supplyDetails with added supplier on success from db: */
      for (let i = 0; i < $scope.supplyDetails.length; i++) {
        if ($scope.supplyDetails[i].supply.id === supply.id) {
          $scope.supplyDetails[i].suppliers.splice($scope.supplyDetails[i].suppliers.indexOf(supplier), 1);
          /* Sets user's current supply in the view: */

          if (supplier.user_id === userId) {
            const supplyName = $scope.supplyDetails[i].supply.name;
            const currentUsersSupplies = $scope.usersSupplies;
            const startIndex = currentUsersSupplies.indexOf(supplyName);
            const endIndex = startIndex + supplyName.length + 2;
            $scope.usersSupplies = currentUsersSupplies.slice(0, startIndex) + currentUsersSupplies.slice(endIndex, currentUsersSupplies.length);
          }
        }
      }
    }, (error) => {
      console.error(error);
    });
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
