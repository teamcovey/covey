angular.module('covey.expenses')
.service('expensesHelpers', function ($routeParams) {
  /* Iterates through all expenses and finds the user's assigned Expense */
  this.getUsersTotal = (expenses, userId) => {
    let userTotal = { balance: 0 };

    expenses.forEach((expense) => {
      if (expense.owner && expense.owner.id.toString() === userId.toString()) {
        userTotal += expense.value;
      }
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
    return $http.post(`/api/expenses/${$routeParams.coveyId}`, newExpense)
      .then((response) => response.data, (error) => {
        console.error(error);
      });
  };

  this.updateExpense = (updateExpense) => {
    console.log('attempt to remove expense', expenseId, $routeParams.coveyId);
    return $http.put(`/api/expenses/${updateExpense.id}`, updateExpense)
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
    return $http.post(`/api/expenses/participants/${$routeParams.coveyId}`, { expense_id: $routeParams.coveyId, user_id: userId })
      .then((response) => response, (error) => {
        console.error(error);
      });
  };

  this.removeParticipant = (expenseId, userId) => {
    return $http.delete(`/api/expensers/${$routeParams.coveyId}/${expenseId}/${userId}`)
      .then((response) => response, (error) => {
        console.error(error);
      });
  };
});
