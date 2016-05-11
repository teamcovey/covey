const User = require('../models/user.js');
const knex = require('../config/config.js').knex;
const keys = require('../config/keys.js');

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
      res.status(200).json({ code });
    }
  });
};

exports.addTel = (req, res) => {
  const phoneNumber = req.body.tel;
  const userId = req.cookies.user_id;

  knex('users')
    .where('id', userId)
    .update({ phoneNumber })
    .then((updatedUser) => {
      res.status(201).json({ updatedUser });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

exports.hasTel = (req, res) => {
  const userId = req.cookies.user_id;

  console.log('In getTel', userId);
  new User({ id: userId })
    .fetch()
    .then((foundUser) => {
      if (foundUser) {
        res.status(200).json(Object.prototype.hasOwnProperty.call(foundUser.attributes, 'phoneNumber'));
      } else {
        res.status(404).json('User not found');
      }
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};
