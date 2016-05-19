// Set databse host based on environment
const dbHost = process.env.covey_env === 'PROD' || process.env.covey_env === 'DEV'
  ? 'postgres' : 'localhost';

const knex = require('knex')({
  client: 'pg',
  connection: {
    user: 'postgres',
    database: 'postgres',
    port: 5432,
    host: dbHost,
    password: 'admin',
  },
  debug: false,
  pool: {
    min: 1,
    max: 2,
  },
});

const db = require('bookshelf')(knex);

db.knex.schema.hasTable('users').then((exists) => {
  if (!exists) {
    db.knex.schema.createTable('users', (user) => {
      user.increments('userId').primary();
      user.string('facebookId', 255).unique();
      user.string('firstName', 25);
      user.string('lastName', 25);
      user.string('email', 60);
      user.string('gender', 20);
      user.string('photoUrl', 255);
      user.string('phoneNumber', 20);
      user.string('accessToken');
      user.string('refreshToken');
    }).then((table) => {
      console.log('Created User Table', table);
    });
  }
});

db.knex.schema.hasTable('coveys').then((exists) => {
  if (!exists) {
    db.knex.schema.createTable('coveys', (covey) => {
      covey.increments('coveyId').primary();
      covey.string('name', 100);
      covey.string('startTime', 100);
      covey.string('endTime', 100);
      covey.string('location', 100);
      covey.string('address', 100);
      covey.string('city', 100);
      covey.string('state', 20);
      covey.string('photoUrl', 255);
      covey.string('details', 10000);
      // we may need to think about how we store event details?
      // maybe as a separate file storage due to length?
      covey.string('blurb', 100);
    }).then((table) => {
      console.log('Created Covey Table', table);
    });
  }
});

db.knex.schema.hasTable('cars').then((exists) => {
  if (!exists) {
    db.knex.schema.createTable('cars', (car) => {
      car.increments('carId').primary();
      car.string('name', 100);
      car.integer('seats', 3);
      car.string('location', 1000);
      car.string('departureTime', 60);
      car.integer('coveyId')
        .unsigned()
        .references('coveyId')
        .inTable('coveys')
        .onDelete('CASCADE');
    }).then((table) => {
      console.log('Created Car Table', table);
    });
  }
});

db.knex.schema.hasTable('resources').then((exists) => {
  if (!exists) {
    db.knex.schema.createTable('resources', (resource) => {
      resource.increments('resourceId').primary();
      resource.string('name', 100);
      resource.integer('quantity', 3);
      resource.string('type', 80);
      resource.integer('coveyId')
        .unsigned()
        .references('coveyId')
        .inTable('coveys')
        .onDelete('CASCADE');
    }).then((table) => {
      console.log('Created Resouce Table', table);
    });
  }
});

db.knex.schema.hasTable('resources_users').then((exists) => {
  if (!exists) {
    db.knex.schema.createTable('resources_users', (resource) => {
      resource.increments('id').primary();
      resource.integer('userId')
        .unsigned()
        .references('userId')
        .inTable('users')
        .onDelete('CASCADE');
      resource.integer('resourceId')
        .unsigned()
        .references('resourceId')
        .inTable('resources')
        .onDelete('CASCADE');
    }).then((table) => {
      console.log('Created Resouces_Users Table', table);
    });
  }
});

db.knex.schema.hasTable('cars_users').then((exists) => {
  if (!exists) {
    db.knex.schema.createTable('cars_users', (resource) => {
      resource.increments('id').primary();
      resource.integer('userId')
        .unsigned()
        .references('userId')
        .inTable('users')
        .onDelete('CASCADE');
      resource.integer('carId')
        .unsigned()
        .references('carId')
        .inTable('cars')
        .onDelete('CASCADE');
      resource.boolean('isDriver');
    }).then((table) => {
      console.log('Created Resouces_Users Table', table);
    });
  }
});

db.knex.schema.hasTable('coveys_users').then((exists) => {
  if (!exists) {
    db.knex.schema.createTable('coveys_users', (resource) => {
      resource.increments('id').primary();
      resource.integer('userId')
        .unsigned()
        .references('userId')
        .inTable('users')
        .onDelete('CASCADE');
      resource.integer('coveyId')
        .unsigned()
        .references('coveyId')
        .inTable('coveys')
        .onDelete('CASCADE');
      resource.boolean('isOwner');
    }).then((table) => {
      console.log('Created Resouces_Users Table', table);
    });
  }
});

db.knex.schema.hasTable('friends').then((exists) => {
  if (!exists) {
    db.knex.schema.createTable('friends', (resource) => {
      resource.increments('id').primary();
      resource.integer('userId')
        .unsigned()
        .references('userId')
        .inTable('users')
        .onDelete('CASCADE');
      resource.integer('friendId')
        .unsigned()
        .references('userId')
        .inTable('users')
        .onDelete('CASCADE');
    }).then((table) => {
      console.log('Created Friends Table', table);
    });
  }
});

db.knex.schema.hasTable('expenses').then((exists) => {
  if (!exists) {
    db.knex.schema.createTable('expenses', (expense) => {
      expense.increments('expenseId').primary();
      expense.string('name', 100);
      expense.float('amount');
      expense.integer('coveyId')
        .unsigned()
        .references('coveyId')
        .inTable('coveys')
        .onDelete('CASCADE');
    }).then((table) => {
      console.log('Created Expenses Table', table);
    });
  }
});

db.knex.schema.hasTable('expenses_users').then((exists) => {
  if (!exists) {
    db.knex.schema.createTable('expenses_users', (expense) => {
      expense.increments('id').primary();
      expense.integer('userId')
        .unsigned()
        .references('userId')
        .inTable('users')
        .onDelete('CASCADE');
      expense.integer('expenseId')
        .unsigned()
        .references('expenseId')
        .inTable('expenses')
        .onDelete('CASCADE');
      expense.boolean('isOwner');
    }).then((table) => {
      console.log('Created Expenses_Users Table', table);
    });
  }
});

module.exports.db = db;
module.exports.knex = knex;
