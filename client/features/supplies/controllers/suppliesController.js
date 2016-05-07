angular.module('covey.supplies', [])
.controller('suppliesController', function ($scope, $rootScope, suppliesHelpers, suppliesHttp) {
  // TODO: logged in userId will be set by some shared Auth service
  const userId = 1;

  $scope.expandSupply = false;
  $scope.supplyDetails = [];
  $scope.usersSupplies = [];
  $scope.attendees = $rootScope.attendees;

  /* Gets all supplies (& supppliers) info for current covey,
  *  and displays logged-in user's assigned supplies as well. */
  const init = () => {
    suppliesHttp.getAllSupplies()
      .then((supplies) => {
        $scope.supplyDetails = supplies;
        console.log('ALL SUPPLIES: ', supplies);
        $scope.usersSupplies = suppliesHelpers.getUsersSupplies(supplies, userId);
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
      suppliesHttp.updateSupply(supply);
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
        /* Reset supplyDetails to not display removed supply */
        $scope.supplyDetails.splice(supplyIndex, 1);
      });
    }
  };

  $scope.addSupplier = (supplier, supply) => {
    suppliesHttp.addSupplier(supply.id, supplier.user_id)
      .then(() => {
        /* Refresh supplyDetails with added supplier on success from db: */
        for (let i = 0; i < $scope.supplyDetails.length; i++) {
          if ($scope.supplyDetails[i].id === supply.id) {
            $scope.supplyDetails[i].suppliers.push(supplier);

            /* If current user is the added supplier, add supply to user's supply assignments */
            if (supplier.user_id === userId) {
              $scope.usersSupplies = suppliesHelpers.getUsersSupplies($scope.supplyDetails, userId);
            }
          }
        }
      }, (error) => {
        console.error(error);
      });
  };

  $scope.removeSupplier = (supplier, supply) => {
    suppliesHttp.removeSupplier(supply.id, supplier.user_id)
    .then(() => {
      /* Refresh supplyDetails with added supplier on success from db: */
      for (let i = 0; i < $scope.supplyDetails.length; i++) {
        if ($scope.supplyDetails[i].id === supply.id) {
          /* If current user is the removed supplier, remove supply from user's suppy assignments */
          if (supplier.user_id === userId) {
            $scope.supplyDetails[i].suppliers.splice($scope.supplyDetails[i].suppliers.indexOf(supplier), 1);
            $scope.usersSupplies = suppliesHelpers.getUsersSupplies($scope.supplyDetails, userId);
          } else {
            $scope.supplyDetails[i].suppliers.splice($scope.supplyDetails[i].suppliers.indexOf(supplier), 1);
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
    if (Array.isArray(attendees)) {
      return attendees.filter((attendee) => {
        let result = true;
        suppliers.forEach((currentSupplier) => {
          if (currentSupplier.user_id === attendee.user_id) {
            result = false;
          }
        });
        return result;
      });
    }
  };
});
