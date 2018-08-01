// Hold application secret and config
require('dotenv').config(); //instatiate environment variables

CONFIG = {}; //Make this global to use all over the application

CONFIG.app = process.env.APP || 'development';
CONFIG.port = process.env.PORT || '3000';

CONFIG.db_dialect = process.env.DB_DIALECT || 'mongo';
CONFIG.db_host = process.env.DB_HOST || 'localhost';
CONFIG.db_port = process.env.DB_PORT || '27017';
CONFIG.db_name = process.env.DB_NAME || 'name';
CONFIG.db_user = process.env.DB_USER || 'root';
CONFIG.db_password = process.env.DB_PASSWORD || 'db-password';

CONFIG.jwt_encryption = process.env.JWT_ENCRYPTION || 'myTopS3cret';
CONFIG.jwt_expiration = process.env.JWT_EXPIRATION || '10000';

CONFIG.log_level = process.env.LOG_LEVEL || 'debug';

CONFIG.from_email = process.env.EMAIL_FROM || 'gmail@chucknorris.com';
CONFIG.email_api_token = process.env.EMAIL_API_TOKEN || '0x.key';

// CONFIG.facebook_id = process.env.FROM_EMAIL || 'changeMe';
// CONFIG.facebook_secret = process.env.FROM_EMAIL || 'changeMe';

// 'facebookAuth' : {
//     'clientID'      : 'your-clientID-here',
//     'clientSecret'  : 'your-client-secret-here',
//     'callbackURL'     : 'http://localhost:4000/api/auth/facebook/callback',
//     'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email'

// },

// 'twitterAuth' : {
//     'consumerKey'        : 'your-consumer-key-here',
//     'consumerSecret'     : 'your-client-secret-here',
//     'callbackURL'        : 'http://localhost:4000/auth/twitter/callback'
// },

// 'googleAuth' : {
//     'clientID'         : 'your-clientID-here',
//     'clientSecret'     : 'your-client-secret-here',
//     'callbackURL'      : 'http://localhost:4000/auth/google/callback'
// }
