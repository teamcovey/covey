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
      if ($scope.expensesDetails[i].expenseId === data.response.expenseId) {
        $scope.expensesDetails[i] = data.response;
        break;
      }
    }
    $scope.usersExpense = expensesHelpers.getUsersTotal($scope.expensesDetails, userId);
  });

  /* SOCKETS:remove expense */
  socket.on(`remove expense ${$routeParams.coveyId}`, (data) => {
    for (let i = 0; i < $scope.expensesDetails.length; i++) {
      if ($scope.expensesDetails[i].expenseId.toString() === data.response.toString()) {
        $scope.expensesDetails.splice(i, 1);
        break;
      }
    }
    $scope.usersExpense = expensesHelpers.getUsersTotal($scope.expensesDetails, userId);
  });

  /* SOCKETS:add participant */
  socket.on(`add participant ${$routeParams.coveyId}`, (data) => {
    for (let i = 0; i < $scope.expensesDetails.length; i++) {
      if ($scope.expensesDetails[i].expenseId.toString() === data.response.expenseId.toString()) {
        for (let j = 0; j < $scope.attendees.length; j++) {
          if ($scope.attendees[j].userId.toString() === data.response.userId.toString()) {
            if ($scope.expensesDetails[i].participants) {
              $scope.expensesDetails[i].participants.push($scope.attendees[j]);
            } else {
              $scope.expensesDetails[i].participants = [$scope.attendees[j]];
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
      if ($scope.expensesDetails[i].expenseId.toString() === data.response.expenseId.toString()) {
        // iterate over expensesDetails and find one that matches expenseId
        // splice out the data.userId from that participants
        for (let j = 0; j < $scope.expensesDetails[i].participants.length; j++) {
          const participantId = $scope.expensesDetails[i].participants[j].userId;
          if (participantId.toString() === data.response.userId.toString()) {
            $scope.expensesDetails[i].participants.splice(j, 1);
            if (data.response.userId.toString() === userId.toString()) {
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
    expensesHttp.removeExpense(expense.expenseId);
  };

  $scope.addParticipant = (participant, expense) => {
    const participantId = participant.userId;
    expensesHttp.addParticipant(expense.expenseId, participantId);
  };

  $scope.removeParticipant = (participant, expense) => {
    const participantId = participant.userId;
    expensesHttp.removeParticipant(expense.expenseId, participantId);
  };
})
.filter('alreadyParticipant', function () {
  return (attendees, participants) => {
    if (Array.isArray(attendees)) {
      return attendees.filter((attendee) => {
        let result = true;
        if (participants) {
          participants.forEach((currentParticipant) => {
            if (currentParticipant.userId === attendee.userId) {
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
