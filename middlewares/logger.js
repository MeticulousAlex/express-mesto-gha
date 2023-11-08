const winston = require('winston');
const expressWinston = require('express-winston');

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'request.log' }),
  ],
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};

// lesson 1 - inro -- done
// lesson 2 - winston and request/error loggers -- done
// lesson 3 -- creation of a remote server -- in process
// lesson 4-6 -- setting ssh and cloud services
// lesson 11 -- CORS
