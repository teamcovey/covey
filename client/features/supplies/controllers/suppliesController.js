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
  *  creates supplyDetails array with all supplies and supplies info,
  *  and sets user's supplies responsibilities as well. */
  const init = () => {
    suppliesHttp.getAllSupplies()
      .then((supplies) => {
        $scope.supplies = supplies;
        let usersCurrentSupply = '';
        supplies.forEach((supply) => {
          suppliesHttp.getAllSuppliers(supply.id).then((suppliers) => {
            // Sets user's current ride in the view:
            usersCurrentSupply += `${suppliesHelpers.findUsersSupplies(suppliers, supply, userId)}, `;
            suppliers.forEach((supplier) => {
              if (supplier.user_id === userId) {
                $scope.usersSupplies += `${supply.name}, `;
              }
            });
            // Sets up cached supplyDetails object:
            $scope.supplyDetails.push({ supply, suppliers });
          });
        });
        // Sets user's current ride in the view:
        $scope.usersSupplies = usersCurrentSupply;
      });
  };

  init();

  /* Toggle edit mode visibility */
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
  $scope.submitSupply = (supply, supplyIndex) => {
    if (supply.id) {
      // suppliesHttp.updateSupply(supply).then((response) => {
      //   console.log('supply updated: ', response);
      // });
    } else {
      suppliesHttp.addSupply(supply).then((response) => {
        console.log('supply created: ', response);
        $scope.supplyDetails[supplyIndex].supply.id = response.id;
      });
    }
  };

  $scope.removeSupply = (supply, supplyIndex) => {
    if (!supply.id) {
      /* removes the empty placeholder supply */
      $scope.supplyDetails.pop();
    } else {
      suppliesHttp.removeSupply(supply.id).then(() => {
        $scope.supplyDetails.splice(supplyIndex, 1);
        /* Set user's current supplies in the view: */
        $scope.usersSupplies += `${suppliesHelpers.findUsersSupplies($scope.supplyDetails[supplyIndex].suppliers, $scope.supplyDetails[supplyIndex].supply, userId)}, `;
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
          $scope.usersSupplies += `${suppliesHelpers.findUsersSupplies($scope.supplyDetails[i].suppliers, $scope.supplyDetails[i].supply, userId)}, `;
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
          const supplyName = $scope.supplyDetails[i].supply.name;
          const currentUsersSupplies = $scope.usersSupplies;
          const startIndex = currentUsersSupplies.indexOf(supplyName);
          const endIndex = startIndex + supplyName.length + 2;
          $scope.usersSupplies = currentUsersSupplies.slice(0, startIndex) + currentUsersSupplies.slice(endIndex, currentUsersSupplies.length);
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
