require('./config/config'); //instantiate configuration variables
const passport = require('passport');
require('./services/passport');
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const logger = require('./config/logger');
const app = express();
const router = require('./router');

// const cors = require('cors');  // we don't need it anymore, because we use proxy server in client app instead
console.log('Server environment:', CONFIG.app);
// DB Setup (connect mongoose and instance of mongodb)

// DB Setup
const mongouri = `${CONFIG.db_dialect}://${CONFIG.db_user}:${CONFIG.db_password}@${
  CONFIG.db_host
}:${CONFIG.db_port}/${CONFIG.db_name}`;

mongoose.Promise = global.Promise;
mongodb: mongoose.connect(
  mongouri,
  {
    keepAlive: 1,
    useMongoClient: true
  }
);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('DB connected to:', CONFIG.db_host);
});

//Logging Middleware
app.use(
  morgan('dev', {
    skip: function(req, res) {
      return res.statusCode < 400;
    },
    stream: process.stderr
  })
);

app.use(
  morgan('dev', {
    skip: function(req, res) {
      return res.statusCode >= 400;
    },
    stream: process.stdout
  })
);
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
// app.use(cors());  // middleware for circumventing cors error
app.use(passport.initialize());
app.use(passport.session());

// Router Setup
router(app);

// Server Setup
const server = http.createServer(app);
server.listen(CONFIG.port);
console.log('Server listening on:', CONFIG.port);
// logger.debug('Logging level: debug');
// logger.info('Logging level: info');
