var mandrill = require('mandrill-api/mandrill');
var async = require('async');
var crypto = require('crypto');

var mandrill_client = new mandrill.Mandrill(CONFIG.email_api_token);
function sendWelcomeEmail(user, host, finalCB) {
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
        mandrill_client.messages.send(
          {
            message: {
              subject: 'Welcome',
              text: host + '/validateEmail/' + user.verifyEmailToken,
              html:
                '<html><body><a href=' +
                host +
                '/validateEmail/' +
                user.verifyEmailToken +
                '>Click here to activate your email <a/></body></html>',
              from_email: 'connections@hyphenmail.com',
              from_name: 'connections',
              to: [
                {
                  email: 'anupkrjha@gmail.com',
                  type: 'to'
                }
              ]
            },
            async: false,
            ip_pool: undefined,
            send_at: new Date()
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
          finalCB();
        }
      }
    }
  );
}

module.exports = {
  sendWelcomeEmail: sendWelcomeEmail
};
