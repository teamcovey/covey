const passport = require('passport');
const StrategyMock = require('./strategy-mock.js');

module.exports = (app, options) => {
  function verifyFunction(user, done) { // user = { id: 1};
    // Emulate database fetch result
    const mock = {
      id: 1,
      // role: User.ROLE_DEFAULT,
      // first_name: 'John',
      // last_name: 'Doe',
    };
    done(null, mock);
  }

  passport.use(new StrategyMock(options, verifyFunction));

  app.get('/mock/login', passport.authenticate('mock'));
};
