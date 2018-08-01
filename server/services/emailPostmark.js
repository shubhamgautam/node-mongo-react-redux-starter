var postmark = require('postmark');
var async = require('async');
var crypto = require('crypto');
const User = require('../models/user');

var client = new postmark.Client(CONFIG.email_api_token);

exports.sendWelcomeEmail = function(user, host, finalCB) {
  host = host.indexOf('localhost') >= 0 ? 'http://' + host : 'https://' + host;
  async.waterfall(
    [
      function(done) {
        crypto.randomBytes(15, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        user.verifyEmailToken = token;
        user.verifyEmailTokenExpires = Date.now() + 3600000 * 24; // 24 hours
        user.isEmailVerified = false;
        user.save(function(err) {
          done(err, user);
        });
      },
      function(user, done) {
        client.sendEmail(
          {
            From: CONFIG.from_email,
            To: user.email,
            Subject: 'Welcome',
            TextBody: host + '/validateEmail/' + user.verifyEmailToken,
            HtmlBody:
              '<html><body><a href=' +
              host +
              '/validateEmail/' +
              user.verifyEmailToken +
              '>Click here to activate your email <a/></body></html>'
          },
          done
        );
      }
    ],
    function(err) {
      if (err) {
        console.log('Could not send welcome email to: ' + user.email);
        console.error(err);
        if (finalCB) {
          finalCB({
            message: 'Could not send welcome email to: ' + user.email
          });
        }
      } else {
        if (finalCB) {
          console.log('Sent welcome email to: ' + user.email);
          finalCB();
        }
      }
    }
  );
};

// module.exports = {
//   sendWelcomeEmail: sendWelcomeEmail
// };
