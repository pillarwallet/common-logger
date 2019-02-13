/*
Copyright (C) 2019 Stiftung Pillar Project

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
const nodePath = require('path');
const fs = require('fs');
const { createLogger, stdSerializers } = require('bunyan');
const RotatingFileStream = require('bunyan-rotating-file-stream');
const responseTime = require('response-time');
const httpRequestSerializer = require('./httpRequestSerializer');

const LOG_GZIP_ENABLED = process.env.LOG_GZIP_ENABLED
  ? process.env.LOG_GZIP_ENABLED
  : true;
const LOG_PERIOD = process.env.LOG_PERIOD ? process.env.LOG_PERIOD : '7d';
const LOG_THRESHOLD = process.env.LOG_THRESHOLD
  ? process.env.LOG_THRESHOLD
  : '5m';

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
        period: LOG_PERIOD,
        totalFiles: 0,
        rotateExisting: true,
        threshold: LOG_THRESHOLD,
        totalSize: 0,
        gzip: LOG_GZIP_ENABLED,
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
