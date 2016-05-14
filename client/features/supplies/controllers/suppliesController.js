angular.module('covey.supplies', ['userId.services', 'covey.attendees'])
.controller('suppliesController', function ($scope, $rootScope, suppliesHelpers, suppliesHttp, userIdFactory, attendeesHttp, socket, $routeParams) {
  const userId = userIdFactory.getUserId();
  $scope.expandSupply = false;
  $scope.supplyDetails = [];
  $scope.usersSupplies = [];

  /* Gets all attendees of this event */
  attendeesHttp.getAllAttendees()
    .then((response) => {
      $scope.attendees = response;
    });

  /* Gets all supplies (& supppliers) info for current covey,
  *  and displays logged-in user's assigned supplies as well. */
  const init = () => {
    suppliesHttp.getAllSupplies()
      .then((supplies) => {
        $scope.supplyDetails = supplies;
        $scope.usersSupplies = suppliesHelpers.getUsersSupplies(supplies, userId);
      });
  };

  init();

  /* SOCKETS:add resource */
  socket.on(`add resource ${$routeParams.coveyId}`, (data) => {
    $scope.supplyDetails.push(data.response);
  });

  /* SOCKETS:update resource */
  socket.on(`update resource ${$routeParams.coveyId}`, (data) => {
    for (let i = 0; i < $scope.supplyDetails.length; i++) {
      if ($scope.supplyDetails[i].id === data.response.id) {
        $scope.supplyDetails[i] = data.response;
        break;
      }
    }
    $scope.usersSupplies = suppliesHelpers.getUsersSupplies($scope.supplyDetails, userId);
  });

  /* SOCKETS:remove resource */
  socket.on(`remove resource ${$routeParams.coveyId}`, (data) => {
    for (let i = 0; i < $scope.supplyDetails.length; i++) {
      if ($scope.supplyDetails[i].id.toString() === data.response.toString()) {
        $scope.supplyDetails.splice(i, 1);
        break;
      }
    }
    $scope.usersSupplies = suppliesHelpers.getUsersSupplies($scope.supplyDetails, userId);
  });

  /* SOCKETS:add supplier */
  socket.on(`add supplier ${$routeParams.coveyId}`, (data) => {
    for (let i = 0; i < $scope.supplyDetails.length; i++) {
      if ($scope.supplyDetails[i].id.toString() === data.response.resourceId.toString()) {
        for (let j = 0; j < $scope.attendees.length; j++) {
          if ($scope.attendees[j].id.toString() === data.response.userId.toString()) {
            if ($scope.supplyDetails[i].suppliers) {
              $scope.supplyDetails[i].suppliers.push($scope.attendees[j]);
            } else {
              $scope.supplyDetails[i].suppliers = [$scope.attendees[j]];
            }

            // If current user is the added supplier, add supply to user's supply assignments
            if (data.response.userId.toString() === userId.toString()) {
              $scope.usersSupplies = suppliesHelpers.getUsersSupplies($scope.supplyDetails, userId);
            }
            break;
          }
        }
      }
    }
    $scope.usersSupplies = suppliesHelpers.getUsersSupplies($scope.supplyDetails, userId);
  });

  /* SOCKETS:remove supplier */
  socket.on(`remove supplier ${$routeParams.coveyId}`, (data) => {
    for (let i = 0; i < $scope.supplyDetails.length; i++) {
      if ($scope.supplyDetails[i].id.toString() === data.response.resourceId.toString()) {
        // iterate over supplyDetails and find one that matches resourceId; splice out the data.userId from that suppliers
        for (let j = 0; j < $scope.supplyDetails[i].suppliers.length; j++) {
          
          const supplierId = $scope.supplyDetails[i].suppliers[j].user_id || $scope.supplyDetails[i].suppliers[j].id || $scope.supplyDetails[i].suppliers[j].userId;;
          if (supplierId.toString() === data.response.userId.toString()) {
          if ($scope.supplyDetails[i].suppliers[j].user_id.toString() === data.response.userId.toString()) {
            $scope.supplyDetails[i].suppliers.splice(j, 1);
            if (data.response.userId.toString() === userId.toString()) {
              $scope.usersSupplies = suppliesHelpers.getUsersSupplies($scope.supplyDetails, userId);
            }
            break;
          }
        }
      }
    }
    $scope.usersSupplies = suppliesHelpers.getUsersSupplies($scope.supplyDetails, userId);
  });

  /* Turn logged-in user's assigned supplies into a string for displaying */
  $scope.reduceUsersSupplies = () => {
    return suppliesHelpers.suppliesToString($scope.usersSupplies);
  };

  /* Toggle edit mode visibility */
  $scope.expandSupplies = () => {
    $scope.expandSupply = !$scope.expandSupply;
  };

  /* POSTs new dummy supply object to db */
  $scope.addNewSupply = () => {
    suppliesHttp.addSupply(suppliesHelpers.newSupplyInput());
  };

  /* Updates a supply when users selects 'Update' in edit view */
  $scope.submitSupply = (supply) => {
    suppliesHttp.updateSupply(supply);
  };

  $scope.removeSupply = (supply) => {
    suppliesHttp.removeSupply(supply.id);
  };

  $scope.addSupplier = (supplier, supply) => {
    suppliesHttp.addSupplier(supply.id, supplier.user_id);
  };

  $scope.removeSupplier = (supplier, supply) => {
    suppliesHttp.removeSupplier(supply.id, supplier.user_id);
  };
})
.filter('alreadySupplier', function () {
  return (attendees, suppliers) => {
    if (Array.isArray(attendees)) {
      return attendees.filter((attendee) => {
        let result = true;
        if (suppliers) {
          suppliers.forEach((currentSupplier) => {
            if (currentSupplier.user_id === attendee.user_id) {
              result = false;
            }
          });
          return result;
        } else {
          return true;
        }
      });
    }
  };
});
