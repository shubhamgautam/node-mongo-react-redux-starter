//Setup Application Level Logs
var appRoot = require('app-root-path');
var winston = require('winston');

// const level = CONFIG.log_level;
// console.log('Logging level:', level);

var options = {
  file: {
    level: 'info',
    name: 'file.info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 100,
    colorize: true
  },
  errorFile: {
    level: 'error',
    name: 'file.error',
    filename: `${appRoot}/logs/error.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 100,
    colorize: true
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true
  }
};

// your centralized logger object
let logger = winston.createLogger({
  transports: [
    //new winston.transports.Console(options.console),
    new winston.transports.File(options.errorFile),
    new winston.transports.File(options.file)
  ],
  exitOnError: false // do not exit on handled exceptions
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (CONFIG.app !== 'production') {
  logger.add(new winston.transports.Console(options.console));
}

module.exports = logger;
