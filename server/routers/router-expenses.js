const knex = require('../config/config.js').knex;

exports.postExpense = (request, response) => {
  knex('expenses')
    .returning(['expense_id', 'name', 'amount', 'covey_id'])
    .insert({
      name: request.body.name,
      amount: request.body.amount,
      covey_id: request.params.covey_id,
    }).then((expenses) => {
      const expense = expenses[0];
      knex('expenses_users')
        .insert(({
          user_id: request.cookies.user_id,
          expense_id: expense.expense_id,
          is_owner: true,
        }))
        .then(() => {
          response.status(201).send({ success: true, expense });
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
    .where({ expense_id: request.body.expense_id })
    .update({
      name: request.body.name,
      amount: request.body.amount,
    })
    .then((expenses) => {
      const expense = expenses[0];
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
      response.status(200).send({ success: true });
    })
    .catch(() => {
      /*eslint-disable*/
      console.log('ERROR: Could not delete expense', err);
      /*eslint-enable*/
      response.status(500).send({ success: false });
    });
};

exports.getExpenses = (request, response) => {
  knex('expenses')
    .where({ covey_id: request.params.covey_id })
    .then((expenses) => {
      response.status(200).send({ expenses });
    })
    .catch((err) => {
      /*eslint-disable*/
      console.log('ERROR: Could not get expenses', err);
      /*eslint-enable*/
      response.status(500).send({ success: false });
    });
};
exports.getExpense = (request, response) => {
  knex('expenses')
    .where({ expense_id: request.params.expense_id })
    .then((expenses) => {
      const expense = expenses[0];
      response.status(200).send({ expense });
    })
    .catch((err) => {
      /*eslint-disable*/
      console.log('ERROR: Could not get expense', err);
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
  checkIfParticipantExists(request.body.expense_id, request.body.user_id)
    .then((exists) => {
      if (!exists) {
        knex('expenses_users')
          .insert({
            user_id: request.body.user_id,
            expense_id: request.body.expense_id,
            is_owner: false,
          })
          .then(() => {
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
  knex('expenses_users')
    .where({
      user_id: request.params.user_id,
      expense_id: request.params.expense_id,
    })
    .del()
    .then(() => {
      response.status(200).send({ success: true });
    })
    .catch((err) => {
      /*eslint-disable*/
      console.log('ERROR: Could not delete participant', err);
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

