const nodePath = require('path');
const fs = require('fs');
const { createLogger, stdSerializers } = require('bunyan');
const RotatingFileStream = require('bunyan-rotating-file-stream');
const responseTime = require('response-time');
const httpRequestSerializer = require('./httpRequestSerializer');

/**
 * @name Constructor
 * @description This is the constructor of the Logger instance.
 * It allows to set Configuration keys:
 *
 * @param {String} name (required) name of Log
 * @param {String} level (optional) set the level for a single output stream
 * @param {String} path (optional) Specify the file path to which log records are written
 * @param {Boolean} src (optional) Defaults to false. Set true to enable 'src' automatic
 *        field with log call source info
 *
 * @returns Object<Logger>
 */
module.exports = ({ name, level = 'info', path = '', src = false }) => {
  let bunyanLogger;

  if (!name) {
    throw new TypeError('`name` is a required option');
  }

  // Checks if path exists
  if (path !== '' && !fs.existsSync(path)) {
    try {
      fs.mkdirSync(path);
    } catch (error) {
      throw new TypeError(
        `Failed to create log file with this path (${path}): ${error.message}`,
      );
    }
  }

  const bunyanOptions = {
    name,
    serializers: stdSerializers,
    level,
    src,
    streams: [
      {
        level,
        stream: process.stdout,
      },
      {
        type: 'raw',
        stream: new RotatingFileStream({
          path: nodePath.join(path, `${name}.log`),
          period: '7d',
          totalFiles: 0,
          rotateExisting: true,
          threshold: '5m',
          totalSize: 0,
          gzip: true,
        }),
      },
    ],
  };

  try {
    bunyanLogger = createLogger(bunyanOptions);
    /**
     * @name middleware
     * @description use this method as middleware to log http requests.
     *
     * @param req
     * @param res
     * @param next
     */
    bunyanLogger.middleware = (req, res, next) => {
      const resTime = responseTime();
      resTime(req, res, next);
      bunyanLogger.info(httpRequestSerializer(req, res), 'HTTP REQUEST');

      next();
    };
  } catch (error) {
    throw new Error(error.message);
  }

  return bunyanLogger;
};
