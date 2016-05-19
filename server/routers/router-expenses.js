const knex = require('../config/config.js').knex;

/*
 * This function is used by the request handlers to
 * retrieve the user(s) associated with an expense
 */
const getExpenseParticipants = expense =>
  knex('users')
    .innerJoin('expenses_users', 'users.userId', 'expenses_users.userId')
    .select('expenses_users.userId', 'expenses_users.isOwner',
      'users.firstName', 'users.lastName', 'users.photoUrl')
    .where({
      expenseId: expense.expenseId,
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
    .returning(['expenseId', 'name', 'amount', 'coveyId'])
    .insert({
      name: request.body.name,
      amount: request.body.amount,
      coveyId: request.body.coveyId,
    }).then((expenses) => {
      const expense = expenses[0];
      knex('expenses_users')
        .insert(({
          userId: request.cookies.userId,
          expenseId: expense.expenseId,
          isOwner: true,
        }))
        .then(() => {
          getExpenseParticipants(expense)
            .then((expenseWithParticipants) => {
              request.io.sockets.emit(`add expense ${request.body.coveyId}`,
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
    .returning(['expenseId', 'name', 'amount', 'coveyId'])
    .where({ expenseId: request.params.expenseId })
    .update({
      name: request.body.name,
      amount: request.body.amount,
    })
    .then((expenses) => {
      // const expense = expenses[0];
      getExpenseParticipants(expenses[0])
        .then((expenseWithParticipants) => {
          request.io.sockets.emit(`update expense ${expenseWithParticipants.coveyId}`,
            { response: expenseWithParticipants });
          response.status(201).send({ success: true, expenseWithParticipants });
        });
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
    .where({ expenseId: request.params.expenseId })
    .del()
    .then(() => {
      request.io.sockets.emit(`remove expense ${request.params.coveyId}`,
        { response: request.params.expenseId });
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
    .select('expenseId', 'name', 'amount')
    .where({ coveyId: request.params.coveyId })
    .then((expenses) => {
      /*eslint-disable*/
      for (var i = 0; i < expenses.length; i++) {
        const expensePromise = new Promise(resolve =>
            getExpenseParticipants(expenses[i])
              .then((expense) => {
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
    .where({ expenseId: request.params.expenseId })
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
      expenseId,
      userId,
    })
    .then((records) => {
      // Return true if participant already exists
      if (records.length !== 0) return true;
      return false;
    });
};

exports.addParticipant = (request, response) => {
  const userId = request.params.userId;
  const expenseId = request.params.expenseId;
  checkIfParticipantExists(expenseId, userId)
    .then((exists) => {
      if (!exists) {
        knex('expenses_users')
          .insert({
            userId,
            expenseId,
            isOwner: false,
          })
          .then(() => {
            request.io.sockets.emit(`add participant ${request.body.coveyId}`,
              { response: { userId, expenseId } });
            response.status(201).send({ success: true });
          })
          .catch((err) => {
            /*eslint-disable*/
            console.log('ERROR: Could not add participant to expense', err);
            /*eslint-enable*/
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
  const userId = request.params.userId;
  const expenseId = request.params.expenseId;
  knex('expenses_users')
    .where({
      userId,
      expenseId,
    })
    .del()
    .then(() => {
      request.io.sockets.emit(`remove participant ${request.params.coveyId}`,
        { response: { userId, expenseId } });
      response.status(200).send({ success: true });
    })
    .catch((err) => {
      /*eslint-disable*/
      console.log('ERROR: Could not delete participant', err);
      /*eslint-enable*/
      response.status(500).send({ success: false });
    });
};

