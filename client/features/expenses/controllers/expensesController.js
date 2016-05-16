angular.module('covey.expenses', ['userId.services', 'covey.attendees'])
.controller('expensesController', function ($rootScope, $scope, expensesHelpers, expensesHttp, userIdFactory, attendeesHttp, socket, $routeParams) {
  const userId = userIdFactory.getUserId();
  $scope.expandExpense = false;
  $scope.expensesDetails = [];
  $scope.usersExpense = 'You don\'t have a total yet.';

  /* Gets all attendees of this event */
  // TODO: trigger this call when attendeesCtrl changes
  attendeesHttp.getAllAttendees()
    .then((response) => {
      $scope.attendees = response;
    });

  /* Gets all expenses (& payers) info for current covey,
  *  and sets logged-in user's current total for display. */
  const init = () => {
    expensesHttp.getAllExpenses()
      .then((expenses) => {
        $scope.expensesDetails = expenses;
        $scope.usersExpense = expensesHelpers.getUsersTotal(expenses, userId);
      });
  };

  init();

  /* SOCKETS:add expense */
  socket.on(`add expense ${$routeParams.coveyId}`, (data) => {
    $scope.expensesDetails.push(data.response);
  });

  /* SOCKETS:update expense */
  socket.on(`update expense ${$routeParams.coveyId}`, (data) => {
    for (let i = 0; i < $scope.expensesDetails.length; i++) {
      if ($scope.expensesDetails[i].id === data.response.id) {
        $scope.expensesDetails[i] = data.response;
        break;
      }
    }
    $scope.usersExpense = expensesHelpers.getUsersExpense($scope.expensesDetails, userId);
  });

  /* SOCKETS:remove expense */
  socket.on(`remove expense ${$routeParams.coveyId}`, (data) => {
    for (let i = 0; i < $scope.expensesDetails.length; i++) {
      if ($scope.expensesDetails[i].id.toString() === data.response.toString()) {
        $scope.expensesDetails.splice(i, 1);
        break;
      }
    }
    $scope.usersExpense = expensesHelpers.getUsersExpense($scope.expensesDetails, userId);
  });

  /* SOCKETS:add payer */
  socket.on(`add payer ${$routeParams.coveyId}`, (data) => {
    for (let i = 0; i < $scope.expensesDetails.length; i++) {
      if ($scope.expensesDetails[i].id.toString() === data.response.carId.toString()) {
        for (let j = 0; j < $scope.attendees.length; j++) {
          if ($scope.attendees[j].id.toString() === data.response.userId.toString()) {
            if ($scope.expensesDetails[i].payers) {
              $scope.expensesDetails[i].payers.push($scope.attendees[j]);
            } else {
              $scope.expensesDetails[i].payers = [$scope.attendees[j]];
            }

            // If current user is the added payer, set expense to user's total
            if (data.response.userId.toString() === userId.toString()) {
              $scope.usersExpense = expensesHelpers.getUsersExpense($scope.expensesDetails, userId);
            }
            break;
          }
        }
      }
    }
    $scope.usersExpense = expensesHelpers.getUsersExpense($scope.expensesDetails, userId);
  });

  /* SOCKETS:remove payer */
  socket.on(`remove payer ${$routeParams.coveyId}`, (data) => {
    for (let i = 0; i < $scope.expensesDetails.length; i++) {
      if ($scope.expensesDetails[i].id.toString() === data.response.carId.toString()) {
        // iterate over expensesDetails and find one that matches expenseId; splice out the data.userId from that payers
        for (let j = 0; j < $scope.expensesDetails[i].payers.length; j++) {
          const payerId = $scope.expensesDetails[i].payers[j].user_id || $scope.expensesDetails[i].payers[j].id || $scope.expensesDetails[i].payers[j].userId;;
          if (payerId.toString() === data.response.userId.toString()) {
            $scope.expensesDetails[i].payers.splice(j, 1);
            if (data.response.userId.toString() === userId.toString()) {
              $scope.usersExpense = expensesHelpers.getUsersExpense($scope.expensesDetails, userId);
            }
            break;
          }
        }
      }
    }
    $scope.usersExpense = expensesHelpers.getUsersExpense($scope.expensesDetails, userId);
  });

  /* Displays user's current ride */
  $scope.stringifyUsersExpense = () => {
    return $scope.usersExpense.name;
  };

  /* Toggle edit mode visibility */
  $scope.expandExpenses = () => {
    $scope.expandExpense = !$scope.expandExpense;
  };

  $scope.addNewExpense = () => {
    expensesHttp.addExpense(expensesHelpers.newExpenseInput());
  };

  /* Creates or updates a ride when user select 'Update' in edit view */
  $scope.submitExpense = (ride) => {
    expensesHttp.updateExpense(ride);
  };

  $scope.removeExpense = (ride) => {
    expensesHttp.removeSupply(ride.id);
  };

  $scope.addPayer = (payer, ride) => {
    const payerId = payer.user_id || payer.userId || payer.id;
    expensesHttp.addPayer(ride.id, payerId);
  };

  $scope.removePayer = (payer, ride) => {
    const payerId = payer.user_id || payer.userId || payer.id;
    expensesHttp.removePayer(ride.id, payerId);
  };
});
