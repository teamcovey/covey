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
})
.service('expensesHttp', function ($http, $routeParams) {
  this.getAllExpenses = () => {
    return $http.get(`/api/expenses/${$routeParams.coveyId}`)
    .then((expenses) => expenses.data, (error) => {
      console.error(error);
    });
  };

  this.addExpense = (newExpense) => {
    return $http.post('/api/expenses', newExpense)
      .then((response) => response.data, (error) => {
        console.error(error);
      });
  };

  this.updateExpense = (updateExpense) => {
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

  this.addPayer = (expenseId, userId) => {
    return $http.post(`/api/expensers/${expenseId}/${userId}`, { coveyId: $routeParams.coveyId })
      .then((response) => response, (error) => {
        console.error(error);
      });
  };

  this.removePayer = (expenseId, userId) => {
    return $http.delete(`/api/expensers/${$routeParams.coveyId}/${expenseId}/${userId}`)
      .then((response) => response, (error) => {
        console.error(error);
      });
  };
});
