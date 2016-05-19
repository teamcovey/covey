const knex = require('../config/config.js').knex;
const _ = require('underscore');
const nodemailer = require('nodemailer');

/*eslint-disable*/
// Set keys file based on environment. Keys.example.js is used in the travis-ci build
var keys = process.env.covey_env === 'PROD'
  || process.env.covey_env === 'DEV'
  || process.env.covey_env === 'LOCAL'
  ? require('../config/keys.js')
  : require('../config/keys.example.js');

const smtpConfig = {
  host: 'auth.smtp.1and1.co.uk',
  port: 587,
  secure: false, // not SSL
  auth: {
    user: 'covey@fwdr.co.uk',
    pass: keys.EMAIL_PASSWORD,
  },
};
/*eslint-enable*/

// SMTP transport
const transporter = nodemailer.createTransport(smtpConfig);

exports.sendEmail = (req, res) => {
  const coveyId = req.params.coveyId;
  const userId = req.params.userId;
  const emailBody = req.body.email;
  const name = req.body.name;

  knex
    .select(['users.email'])
    .from('users')
    .innerJoin('coveys_users', 'users.userId', 'coveys_users.userId')
    .where('coveyId', '=', coveyId)
    .then((emails) => {
      const toEmailsList = _.reduceRight(emails, (a, b) => `${b.email}, ${a}`, '');

      knex
        .select(['users.firstName', 'users.lastName', 'users.email'])
        .from('users')
        .where('userId', '=', userId)
        .then((foundUser) => {
          const fromName = `${foundUser[0].firstName} ${foundUser[0].lastName}`;

          const mailOptions = {
            from: `"${fromName} @ Covey" <no-reply@mycovey.com>`, // Make this from the user
            to: toEmailsList,
            subject: `🐤 A message from your covey, ${name} 🐤`,
            text: emailBody,
          };

          // Send mail
          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              res.status(404).json(err);
            } else {
              res.status(201).json(`Message sent: ${info.response}`);
            }
          });
        });
    });
};
