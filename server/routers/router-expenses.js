const knex = require('../config/config.js').knex;

/*
 * This function is used by the request handlers to
 * retrieve the user(s) associated with an expense
 */
const getExpenseParticipants = expense =>
  knex('users')
    .innerJoin('expenses_users', 'users.id', 'expenses_users.user_id')
    .select('expenses_users.user_id', 'expenses_users.is_owner',
      'users.firstName', 'users.lastName', 'users.photoUrl')
    .where({
      expense_id: expense.expense_id,
    })
    .then((participants) => {
      /*eslint-disable*/
      expense.participants = participants;
      /*eslint-enable*/
      return expense;
    })
    .catch((err) => {
      /*eslint-disable*/
      console.log('ERROR: Could not retrieve participants for expense', err);
      /*eslint-enable*/
    });

exports.postExpense = (request, response) => {
  knex('expenses')
    .returning(['expense_id', 'name', 'amount', 'covey_id'])
    .insert({
      name: request.body.name,
      amount: request.body.amount,
      covey_id: request.body.covey_id,
    }).then((expenses) => {
      const expense = expenses[0];
      knex('expenses_users')
        .insert(({
          user_id: request.cookies.user_id,
          expense_id: expense.expense_id,
          is_owner: true,
        }))
        .then(() => {
          getExpenseParticipants(expense)
            .then((expenseWithParticipants) => {
              request.io.sockets.emit(`add expense ${request.body.covey_id}`,
                { response: expenseWithParticipants });
              response.status(201).send({ success: true, expense: expenseWithParticipants });
            })
            .catch((err) => {
              /*eslint-disable*/
              console.log('ERROR: Could not retrieve participants for expense', err);
              /*eslint-enable*/
              response.status(201).send({ success: true, expense });
            });
        })
        .catch((err) => {
          /*eslint-disable*/
          console.log('ERROR: Could not add expense to expenses', err);
          /*eslint-enable*/
          response.status(500).send({ success: false });
        });
    })
    .catch((err) => {
      /*eslint-disable*/
      console.log('ERROR: Could not add expense to expenses', err);
      /*eslint-enable*/
      response.status(500).send({ success: false });
    });
};

exports.updateExpense = (request, response) => {
  knex('expenses')
    .returning(['expense_id', 'name', 'amount', 'covey_id'])
    .where({ expense_id: request.params.expense_id })
    .update({
      name: request.body.name,
      amount: request.body.amount,
    })
    .then((expenses) => {
      const expense = expenses[0];
      request.io.sockets.emit(`update expense ${expense.covey_id}`, { response: expense });
      response.status(201).send({ success: true, expense });
    })
    .catch((err) => {
      /*eslint-disable*/
      console.log('ERROR: Could not update expense', err);
      /*eslint-enable*/
      response.status(500).send({ success: false });
    });
};

exports.deleteExpense = (request, response) => {
  knex('expenses')
    .where({ expense_id: request.params.expense_id })
    .del()
    .then(() => {
      request.io.sockets.emit(`remove expense ${request.params.covey_id}`,
        { response: request.params.expense_id });
      response.status(200).send({ success: true });
    })
    .catch((err) => {
      /*eslint-disable*/
      console.log('ERROR: Could not delete expense', err);
      /*eslint-enable*/
      response.status(500).send({ success: false });
    });
};


exports.getExpenses = (request, response) => {
  const expensesArray = [];
  const expensePromises = [];
  knex('expenses')
    .select('expense_id', 'name', 'amount')
    .where({ covey_id: request.params.covey_id })
    .then((expenses) => {
      /*eslint-disable*/
      for (var i = 0; i < expenses.length; i++) {
        const expensePromise = new Promise(resolve =>
            getExpenseParticipants(expenses[i])
              .then((expense) => {
                console.log(expense);
                expensesArray.push(expense);
                resolve();
              })
              .catch((err) => {
                /*eslint-disable*/
                console.log('ERROR: Could not retrieve participants for expense', err);
                /*eslint-enable*/
              })
        );
        expensePromises.push(expensePromise);
      }
      /*eslint-enable*/
      Promise.all(expensePromises)
        .then(() => {
          response.status(200).send({ success: true, expenses: expensesArray });
        });
    })
    .catch((err) => {
      /*eslint-disable*/
      console.log('ERROR: Could not get expenses', err);
      /*eslint-enable*/
      response.status(500).send({ success: false });
    });
};

exports.getParticipants = (request, response) => {
  knex('expenses_users')
    .where({ expense_id: request.params.expense_id })
    .then((participants) => {
      response.status(200).send({ success: true, participants });
    })
    .catch((err) => {
      /*eslint-disable*/
      console.log('ERROR: Could not get particpants', err);
      /*eslint-enable*/
      response.status(500).send({ success: false });
    });
};

// Checks if user already participating in expense. Used in addParticpant request handler
const checkIfParticipantExists = (expenseId, userId) => {
  return knex('expenses_users')
    .where({
      expense_id: expenseId,
      user_id: userId,
    })
    .then((records) => {
      // Return true if participant already exists
      if (records.length !== 0) return true;
      return false;
    });
};

exports.addParticipant = (request, response) => {
  const userId = request.params.user_id;
  const expenseId = request.params.expense_id;
  checkIfParticipantExists(expenseId, userId)
    .then((exists) => {
      if (!exists) {
        knex('expenses_users')
          .insert({
            user_id: userId,
            expense_id: expenseId,
            is_owner: false,
          })
          .then(() => {
            response.status(201).send({ success: true });
          })
          .catch((err) => {
            /*eslint-disable*/
            console.log('ERROR: Could not add participant to expense', err);
            /*eslint-enable*/
            request.io.sockets.emit(`add particpant ${request.body.covey_id}`,
              { response: { user_id: userId, expense_id: expenseId } });
            response.status(500).send({ success: false });
          });
      } else {
        response.status(400).send({ success: false });
      }
    })
    .catch((err) => {
      /*eslint-disable*/
      console.log('ERROR: Could not check for participant in expense', err);
      /*eslint-enable*/
      response.status(500).send({ success: false });
    });
};


exports.deleteParticipant = (request, response) => {
  const userId = request.params.user_id;
  const expenseId = request.params.expense_id;
  knex('expenses_users')
    .where({
      user_id: userId,
      expense_id: expenseId,
    })
    .del()
    .then(() => {
      request.io.sockets.emit(`remove particpant ${request.params.covey_id}`,
        { response: { user_id: userId, expense_id: expenseId } });
      response.status(200).send({ success: true });
    })
    .catch((err) => {
      /*eslint-disable*/
      console.log('ERROR: Could not delete participant', err);
      /*eslint-enable*/
      response.status(500).send({ success: false });
    });
};

