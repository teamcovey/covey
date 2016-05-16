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

  /* Gets all expenses (& participants) info for current covey,
  *  and sets logged-in user's current total for display. */
  const init = () => {
    expensesHttp.getAllExpenses()
      .then((expenses) => {
        $scope.expensesDetails = expenses.expenses;
        $scope.usersExpense = expensesHelpers.getUsersTotal(expenses.expenses, userId);
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
      if ($scope.expensesDetails[i].id === data.response.expense_id) {
        $scope.expensesDetails[i] = data.response;
        break;
      }
    }
    $scope.usersExpense = expensesHelpers.getUsersTotal($scope.expensesDetails, userId);
  });

  /* SOCKETS:remove expense */
  socket.on(`remove expense ${$routeParams.coveyId}`, (data) => {
    for (let i = 0; i < $scope.expensesDetails.length; i++) {
      if ($scope.expensesDetails[i].id.toString() === data.response.toString()) {
        $scope.expensesDetails.splice(i, 1);
        break;
      }
    }
    $scope.usersExpense = expensesHelpers.getUsersTotal($scope.expensesDetails, userId);
  });

  /* SOCKETS:add participant */
  socket.on(`add participant ${$routeParams.coveyId}`, (data) => {
    for (let i = 0; i < $scope.expensesDetails.length; i++) {
      if ($scope.expensesDetails[i].expense_id.toString() === data.response.expense_id.toString()) {
        for (let j = 0; j < $scope.attendees.length; j++) {
          if ($scope.attendees[j].id.toString() === data.response.user_id.toString()) {
            if ($scope.expensesDetails[i].participants) {
              $scope.expensesDetails[i].participants.push($scope.attendees[j]);
            } else {
              $scope.expensesDetails[i].participants = [$scope.attendees[j]];
            }

            // If current user is the added participant, set expense to user's total
            if (data.response.user_id.toString() === userId.toString()) {
              $scope.usersExpense = expensesHelpers.getUsersTotal($scope.expensesDetails, userId);
            }
            break;
          }
        }
      }
    }
    $scope.usersExpense = expensesHelpers.getUsersTotal($scope.expensesDetails, userId);
  });

  /* SOCKETS:remove participant */
  socket.on(`remove participant ${$routeParams.coveyId}`, (data) => {
    for (let i = 0; i < $scope.expensesDetails.length; i++) {
      if ($scope.expensesDetails[i].expense_id.toString() === data.response.expense_id.toString()) {
        // iterate over expensesDetails and find one that matches expenseId
        // splice out the data.userId from that participants
        for (let j = 0; j < $scope.expensesDetails[i].participants.length; j++) {
          const participantId = $scope.expensesDetails[i].participants[j].user_id;
          if (participantId.toString() === data.response.user_id.toString()) {
            $scope.expensesDetails[i].participants.splice(j, 1);
            if (data.response.user_id.toString() === userId.toString()) {
              $scope.usersExpense = expensesHelpers.getUsersTotal($scope.expensesDetails, userId);
            }
            break;
          }
        }
      }
    }
    $scope.usersExpense = expensesHelpers.getUsersTotal($scope.expensesDetails, userId);
  });

  /* Displays user's current expense */
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

  /* Creates or updates a expense when user select 'Update' in edit view */
  $scope.submitExpense = (expense) => {
    expensesHttp.updateExpense(expense);
  };

  $scope.removeExpense = (expense) => {
    expensesHttp.removeExpense(expense.expense_id);
  };

  $scope.addParticipant = (participant, expense) => {
    const participantId = participant.user_id || participant.userId || participant.id;
    expensesHttp.addParticipant(expense.expense_id, participantId);
  };

  $scope.removeParticipant = (participant, expense) => {
    const participantId = participant.user_id || participant.userId || participant.id;
    expensesHttp.removeParticipant(expense.expense_id, participantId);
  };
})
.filter('alreadyParticipant', function () {
  return (attendees, participants) => {
    if (Array.isArray(attendees)) {
      return attendees.filter((attendee) => {
        let result = true;
        if (participants) {
          participants.forEach((currentParticipant) => {
            if (currentParticipant.user_id === attendee.user_id) {
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
