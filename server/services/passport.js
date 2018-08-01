const passport = require('passport');
const User = require('../models/user');
const config = require('../config/config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { Strategy: LocalStrategy } = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// var FacebookTokenStrategy = require('passport-facebook-token');
// var TwitterTokenStrategy = require('passport-twitter-token');
// var GoogleTokenStrategy = require('passport-google-token').Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Setup options for JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: CONFIG.jwt_encryption // for decoding JWT
};

// Create JWT strategy (authenticate user with JWT)
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // the function will be called whenever we need to authenticate a user with a JWT token
  // - payload: decoded JWT token ('sub' and 'iat', refer to jwt.encode in authentication.js)
  // - done: a callback function we need to call depending on whether or not we are able to successfully authenticate this user

  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that user
  // Otherwise, call 'done' without a user object
  User.findById(payload.sub, function(err, user) {
    if (err) {
      return done(err, false);
    }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

// Setup options for local strategy
const localOptions = { usernameField: 'email' }; // if you are looking for username, look for email (cause we use email here)

// Create local strategy (authenticate user with email and password)
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  // Verify this email and password
  // Call done with the user if it is the correct email and password
  // Otherwise, call done with false

  User.findOne({ email: email }, function(err, user) {
    if (err) {
      return done(err);
    }

    if (!user) {
      return done(null, false, { message: 'Incorrect email.' });
    }

    if (!user.isEmailVerified) {
      console.log(!user.isEmailVerified);
      return done(null, false, { message: 'Email not verified.' });
    }

    // Compare passwords - is `password` equal to user.password?
    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        console.log('Error');
        return done(err);
      }

      if (!isMatch) {
        console.log('isMatch');
        return done(null, false, { message: 'Incorrect password.' }); // that last argument is the info argument to the authenticate callback
      }
      console.log('done');
      // Found the user (email and password are correct), then assign it to req.user, which then be used in signin() in authentication.js
      return done(null, user);
    });
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: '350931949354-q1ajdn8pl3ic2hue25vtk6f7t2c3rkni.apps.googleusercontent.com',
      clientSecret: '3ESccVx199ZEZKhdwmrQv7E3',
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile.name.givenName);
      console.log(profile.name.familyName);
      console.log(profile.provider);
      console.log(profile.emails[0].value);
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      }

      const user = await new User({ googleId: profile.id }).save();
      done(null, user);
    }
  )
);

passport.use(jwtLogin); // For making auth'd request
passport.use(localLogin); // For signing in user
