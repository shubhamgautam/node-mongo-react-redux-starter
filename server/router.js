const Authentication = require('./controllers/authentication');
const Profile = require('./controllers/userinfo');
const Blog = require('./controllers/blog');
const upload = require('./services/fileUploadDisk');

// service
const passport = require('passport');
const passportService = require('./services/passport');

// middleware in between Incoming Request and Route Handler
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {
  /**
   * Authentication APIs
   */

  app.get('/api/', function(req, res) {
    res.status(200).send({ message: 'Working!' });
  });

  app.post('/api/signup', Authentication.signup);

  app.post('/api/signin', requireSignin, Authentication.signin);
  app.get('/validateEmail/:token', Authentication.validateEmail);

  app.get('/api/verify_jwt', requireAuth, Authentication.verifyJwt);
  app.post('/api/fileUpload', upload.single('profileImage'), Profile.saveImage);
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    res.redirect('/');
  });

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  // app.get('/resendValidationEmail', expressJwt({
  //   secret: process.env.JWT_SECRET
  // }), function(req, res, next) {

  //   User.findById({
  //     '_id': req.user._id
  //   }, function(err, user) {
  //     if (err)
  //       throw err;

  //     //send welcome email w/ verification token
  //     email.sendWelcomeEmail(user, req.headers.host, function(err) {
  //       if (err) {
  //         res.status(404).json(err);
  //       } else {
  //         res.send({
  //           message: 'Email was resent'
  //         })
  //       }
  //     });
  //   });
  // });

  // router.post(
  //   '/updateEmail', function(req, res, next) {
  //     if (!req.user) {
  //       return res.status(401).json({
  //         message: 'Permission Denied!'
  //       });
  //     }

  //     var newEmail = req.body.email && req.body.email.trim();

  //     isUserUnique(req.body, function(err) {
  //       if (err) {
  //         return res.status(403).json(err);
  //       }
  //       User.findOneAndUpdate({
  //         '_id': req.user._id
  //       }, {
  //         email: newEmail
  //       }, {
  //         new: true
  //       }, function(err, user) {
  //         if (err)
  //           throw err;

  //         //send welcome email w/ verification token
  //         email.sendWelcomeEmail(user, req.headers.host);

  //         res.json({
  //           message: 'Email was updated'
  //         });

  //       });
  //     });

  /**
   * Profile APIs
   */

  app.get('/api/profile', requireAuth, Profile.fetchProfile);

  app.put('/api/profile', requireAuth, Profile.updateProfile);

  app.put('/api/password', requireAuth, Profile.resetPassword);

  /**
   * Blog Post APIs
   */

  app.get('/api/posts', Blog.fetchPosts);

  app.post('/api/posts', requireAuth, Blog.createPost);

  app.get('/api/posts/:id', Blog.fetchPost);

  app.get('/api/allow_edit_or_delete/:id', requireAuth, Blog.allowUpdateOrDelete);

  app.put('/api/posts/:id', requireAuth, Blog.updatePost);

  app.delete('/api/posts/:id', requireAuth, Blog.deletePost);

  app.get('/api/my_posts', requireAuth, Blog.fetchPostsByAuthorId);

  /**
   * Blog Comment APIs
   */

  app.post('/api/comments/:postId', requireAuth, Blog.createComment);

  app.get('/api/comments/:postId', Blog.fetchCommentsByPostId);

  //   router.route('/auth/twitter/reverse')
  //     .post(function(req, res) {
  //         request.post({
  //             url: 'https://api.twitter.com/oauth/request_token',
  //             oauth: {
  //                 oauth_callback: "http%3A%2F%2Flocalhost%3A3000%2Ftwitter-callback",
  //                 consumer_key: config.twitterAuth.consumerKey,
  //                 consumer_secret: config.twitterAuth.consumerSecret
  //             }
  //         }, function (err, r, body) {
  //             if (err) {
  //                 return res.send(500, { message: e.message });
  //             }
  //             var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
  //             res.send(JSON.parse(jsonStr));
  //         });
  //     });

  // router.route('/auth/twitter')
  //     .post((req, res, next) => {
  //         request.post({
  //             url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
  //             oauth: {
  //                 consumer_key: config.twitterAuth.consumerKey,
  //                 consumer_secret: config.twitterAuth.consumerSecret,
  //                 token: req.query.oauth_token
  //             },
  //             form: { oauth_verifier: req.query.oauth_verifier }
  //         }, function (err, r, body) {
  //             if (err) {
  //                 return res.send(500, { message: err.message });
  //             }

  //             const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
  //             const parsedBody = JSON.parse(bodyString);

  //             req.body['oauth_token'] = parsedBody.oauth_token;
  //             req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
  //             req.body['user_id'] = parsedBody.user_id;

  //             next();
  //         });
  //     }, passport.authenticate('twitter-token', {session: false}), function(req, res, next) {
  //         if (!req.user) {
  //             return res.send(401, 'User Not Authenticated');
  //         }
  //         req.auth = {
  //             id: req.user.id
  //         };

  //         return next();
  //     }, generateToken, sendToken);

  // router.route('/auth/facebook')
  //     .post(passport.authenticate('facebook-token', {session: false}), function(req, res, next) {
  //         if (!req.user) {
  //             return res.send(401, 'User Not Authenticated');
  //         }
  //         req.auth = {
  //             id: req.user.id
  //         };

  //         next();
  //     }, generateToken, sendToken);

  // router.route('/auth/google')
  //     .post(passport.authenticate('google-token', {session: false}), function(req, res, next) {
  //         if (!req.user) {
  //             return res.send(401, 'User Not Authenticated');
  //         }
  //         req.auth = {
  //             id: req.user.id
  //         };

  //         next();
  //     }, generateToken, sendToken);
};
