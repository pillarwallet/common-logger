const nodePath = require('path');
const fs = require('fs');
const { createLogger, stdSerializers } = require('bunyan');
const RotatingFileStream = require('bunyan-rotating-file-stream');

/**
 * @name Constructor
 * @description This is the constructor of the Logger instance.
 * It allows to set Configuration keys:
 *
 * @param {String} fileName (required) name of Log
 * @param {String} level (optional) set the level for a single output stream
 * @param {String} path (optional) Specify the file path to which log records are written
 * @param {Boolean} src (optional) Defaults to false. Set true to enable 'src' automatic
 *        field with log call source info
 *
 * @returns Object<Logger>
 */
module.exports = ({ fileName, level = 'info', path = '', src = false }) => {
  let bunyanLogger;

  if (!fileName) {
    throw new TypeError('`fileName` is a required option');
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
    name: fileName,
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
          path: nodePath.join(path, `${fileName}.log`),
          period: '1d',
          totalFiles: 10,
          rotateExisting: true,
          threshold: '10m',
          totalSize: '20m',
          gzip: true,
        }),
      },
    ],
  };

  try {
    bunyanLogger = createLogger(bunyanOptions);

    return bunyanLogger;
  } catch (error) {
    throw new Error(error.message);
  }
};
