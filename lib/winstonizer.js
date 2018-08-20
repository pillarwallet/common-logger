const winston = require('winston');

let winstonLogger;

const construct = (...args) => {
  console.log(...args);

  winstonLogger = winston.createLogger();

  return winstonLogger;
};

module.exports = construct;
