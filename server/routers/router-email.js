const knex = require('../config/config.js').knex;
const _ = require('underscore');
const nodemailer = require('nodemailer');

const smtpConfig = {
  host: 'auth.smtp.1and1.co.uk',
  port: 587,
  secure: false, // not SSL
  auth: {
    user: 'covey@fwdr.co.uk',
    pass: 'TeamCovey2016',
  },
};

// SMTP transport
const transporter = nodemailer.createTransport(smtpConfig);

exports.sendEmail = (req, res) => {
  const coveyId = req.params.coveyId;
  // const userId = req.params.userId;
  // const emailMessage = req.body.emailMessage;

  // console.log('In sendEmail: / coveyId: ', coveyId);
  // console.log('In sendEmail: / userId: ', userId);
  // console.log('In sendEmail: / emailMessage: ', emailMessage);

  knex
    .select(['users.email'])
    .from('users')
    .innerJoin('coveys_users', 'users.id', 'coveys_users.user_id')
    .where('covey_id', '=', coveyId)
    .then((emails) => {
      const emailString = _.reduceRight(emails, (a, b) => `${b.email}, ${a}`, '');
      console.log(emailString);

      const mailOptions = {
        from: '"Team Covey" <hello@mycovey.com>',
        to: emailString,
        subject: 'Hello',
        text: 'This works!',
        // html: '<b>Hello world</b>'
      };

      // Send mail
      transporter.sendMail(mailOptions, (error, info) => {
        console.log('Message sent: ' + info.response);
        const response = 'Message sent: ' + info.response;
        res.status(201).json(response);
      })
      .catch((err) => {
        res.status(404).json(err);
      });
    });
};
