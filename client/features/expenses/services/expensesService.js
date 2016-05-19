angular.module('covey.expenses')
.service('expensesHelpers', function ($routeParams) {
  /* Iterates through all expenses and finds the user's assigned Expense */
  this.getUsersTotal = (expenses, userId) => {
    const userTotal = { paid: 0, owe: 0 };

    expenses.forEach((expense) => {
      // need to check each participant
      expense.participants.forEach((participant) => {
        const testId = participant.userId;
        if (testId.toString() === userId.toString()) {
          if (participant.isOwner) {
            userTotal.paid += parseFloat(expense.amount);
          } else {
            userTotal.owe += parseFloat(expense.amount / expense.participants.length);
          }
        }
      });
    });
    return userTotal;
  };

  this.newExpenseInput = () => (
    {
      name: 'add expense',
      quantity: 10,
      amount: '0',
      coveyId: $routeParams.coveyId,
      suppliers: [],
    }
  );
})
.service('expensesHttp', function ($http, $routeParams) {
  this.getAllExpenses = () => {
    return $http.get(`/api/expenses/${$routeParams.coveyId}`)
    .then((expenses) => expenses.data, (error) => {
      console.error(error);
    });
  };

  this.addExpense = (newExpense) => {
    return $http.post('/api/expenses/', newExpense)
      .then((response) => response.data, (error) => {
        console.error(error);
      });
  };

  this.updateExpense = (updateExpense) => {
    return $http.put(`/api/expenses/${updateExpense.expenseId}`, updateExpense)
      .then((response) => response, (error) => {
        console.error(error);
      });
  };

  this.removeExpense = (expenseId) => {
    return $http.delete(`/api/expenses/${$routeParams.coveyId}/${expenseId}`)
      .then((response) => response, (error) => {
        console.error(error);
      });
  };

  this.addParticipant = (expenseId, userId) => {
    return $http.post(`/api/expenses/participants/${expenseId}/${userId}`, { coveyId: $routeParams.coveyId })
      .then((response) => response, (error) => {
        console.error(error);
      });
  };

  this.removeParticipant = (expenseId, userId) => {
    return $http.delete(`/api/expenses/participants/${$routeParams.coveyId}/${expenseId}/${userId}`)
      .then((response) => response, (error) => {
        console.error(error);
      });
  };
});
