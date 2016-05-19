const User = require('../models/user.js');
const knex = require('../config/config.js').knex;

/*eslint-disable*/
// Set keys file based on environment. Keys.example.js is used in the travis-ci build
var keys = process.env.covey_env === 'PROD'
  || process.env.covey_env === 'DEV'
  || process.env.covey_env === 'LOCAL'
  ? require('../config/keys.js')
  : require('../config/keys.example.js');
  /*eslint-enable*/

const generateCode = () => {
  const min = 1000;
  const max = 9000;
  const code = Math.floor(Math.random() * (max - min) + min);
  return code;
};

exports.generateCodeAndSend = (req, res) => {
  const tel = req.params.tel;
  const code = generateCode();
  const accountSid = keys.TWILIO_ACCOUNT_SID;
  const authToken = keys.TWILIO_AUTH_TOKEN;
  const client = require('twilio')(accountSid, authToken);

  client.messages.create({
    to: tel,
    from: keys.TWILIO_FROM_NUM,
    body: `Your Covey verification code is: ${code}`,
  },
  (err, message) => {
    if (err) {
      console.error('Error: ', err);
      res.status(500).json('Server could not send verification message');
    } else {
      console.log(message.sid);
      res.status(201).json({ code });
    }
  });
};

exports.addTel = (req, res) => {
  const phoneNumber = req.body.tel;
  const userId = req.cookies.userId;

  knex('users')
    .where('userId', userId)
    .update({ phoneNumber })
    .then((updatedUser) => {
      console.log('In addTel: ', updatedUser);
      res.status(201).json({ updatedUser });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

exports.hasTel = (req, res) => {
  const userId = req.cookies.userId;

  new User({ userId })
    .fetch()
    .then((foundUser) => {
      if (foundUser.attributes.phoneNumber === null) {
        res.status(200).json(false);
      } else {
        res.status(200).json(true);
      }
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};
