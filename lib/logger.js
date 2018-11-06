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
 * @param {String} name name of Log
 * @param {String} [level] set the level for a single output stream
 * @param {String} [path] Specify the file path to which log records are written
 * @param {Boolean} [src] Defaults to false. Set true to enable 'src' automatic
 * field with log call source info
 * @param {Boolean} [logToFile] Enables logging to a file and file rotation. True
 * by default.
 *
 * @returns Object<Logger>
 */
module.exports = ({
  name,
  level = 'info',
  path = '',
  src = false,
  logToFile = true,
}) => {
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
    ],
  };

  /**
   * When running as part of a test environment, it appears that
   * the 'bunyan-rotating-file-stream' module cannot access the
   * required Node.js bindings or modules to be able to rotate log
   * files. This conditional prevents the module from being loaded
   * when logToFile is false.
   */
  if (logToFile) {
    bunyanOptions.streams.push({
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
    });
  }

  try {
    bunyanLogger = createLogger(bunyanOptions);
    /**
     * @name middleware
     * @description use this method as middleware to log http requests.
     *
     */
    bunyanLogger.middleware = () =>
      responseTime((req, res, time) => {
        bunyanLogger.info(
          httpRequestSerializer(req, res, time),
          'HTTP REQUEST',
        );
      });
  } catch (error) {
    throw new Error(error.message);
  }

  return bunyanLogger;
};
