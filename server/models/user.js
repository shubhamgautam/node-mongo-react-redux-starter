const mongoose = require('mongoose');
//var timestamps = require('mongoose-timestamp');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
// Define model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
  firstName: String,
  lastName: String,
  admin: { type: Boolean, default: false },
  imagePath: String,
  verifyEmailToken: String,
  verifyEmailTokenExpires: Date,
  isEmailVerified: { type: Boolean, default: false },
  googleId: String,
  birthday: { type: String, default: '' },
  sex: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  occupation: { type: String, default: '' },
  description: { type: String, default: '' }
});

//userSchema.plugin(timestamps);

// userSchema.virtual('fullName').set(function(name) {
//   var split = name.split(' ');
//   this.first = split[0];
//   this.last = split[1];
// });

// On Save Hook, encrypt the password
// userSchema.pre('save', function(next) {
//   // before saving the model, run this funtion

//   const user = this; // get access to the user model

//   bcrypt.genSalt(10, function(err, salt) {
//     if (err) {
//       return next(err);
//     }

//     bcrypt.hash(user.password, salt, null, function(err, hash) {
//       if (err) {
//         return next(err);
//       }
//       user.password = hash;
//       console.log('Hashed Password:', hash);
//       next();
//     });
//   });
// });

/**
 * Encrypt password if new user or modified password
 */
userSchema.pre('save', function saveHook(next) {
  let user = this;
  // proceed further only if the password is modified or the user is new
  if (!user.isModified('password')) return next();

  return bcrypt.hash(user.password, 10, (hashError, hash) => {
    if (hashError) {
      return next(hashError);
    }

    // replace a password string with hash value
    user.password = hash;

    return next();
  });
});

// userSchema.methods: Whenever we create a user object, it's going to have access to any functions that we define on this methods property
userSchema.methods.comparePassword = function(candidatePassword, callback) {
  // used in LocalStrategy

  // candidatePassword will be encrypted internally in this function
  bcrypt.compare(candidatePassword, this.password, callback);
};

// UserSchema.statics.upsertTwitterUser = function(token, tokenSecret, profile, cb) {
//   var that = this;
//   return this.findOne(
//     {
//       'twitterProvider.id': profile.id
//     },
//     function(err, user) {
//       // no user was found, lets create a new one
//       if (!user) {
//         var newUser = new that({
//           email: profile.emails[0].value,
//           twitterProvider: {
//             id: profile.id,
//             token: token,
//             tokenSecret: tokenSecret
//           }
//         });

//         newUser.save(function(error, savedUser) {
//           if (error) {
//             console.log(error);
//           }
//           return cb(error, savedUser);
//         });
//       } else {
//         return cb(err, user);
//       }
//     }
//   );
// };

// UserSchema.statics.upsertFbUser = function(accessToken, refreshToken, profile, cb) {
//   var that = this;
//   return this.findOne(
//     {
//       'facebookProvider.id': profile.id
//     },
//     function(err, user) {
//       // no user was found, lets create a new one
//       if (!user) {
//         var newUser = new that({
//           fullName: profile.displayName,
//           email: profile.emails[0].value,
//           facebookProvider: {
//             id: profile.id,
//             token: accessToken
//           }
//         });

//         newUser.save(function(error, savedUser) {
//           if (error) {
//             console.log(error);
//           }
//           return cb(error, savedUser);
//         });
//       } else {
//         return cb(err, user);
//       }
//     }
//   );
// };

// UserSchema.statics.upsertGoogleUser = function(accessToken, refreshToken, profile, cb) {
//   var that = this;
//   return this.findOne(
//     {
//       'googleProvider.id': profile.id
//     },
//     function(err, user) {
//       // no user was found, lets create a new one
//       if (!user) {
//         var newUser = new that({
//           fullName: profile.displayName,
//           email: profile.emails[0].value,
//           googleProvider: {
//             id: profile.id,
//             token: accessToken
//           }
//         });

//         newUser.save(function(error, savedUser) {
//           if (error) {
//             console.log(error);
//           }
//           return cb(error, savedUser);
//         });
//       } else {
//         return cb(err, user);
//       }
//     }
//   );
// };
// Create the model class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;
