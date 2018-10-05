const nodePath = require('path');
const { createLogger, stdSerializers } = require('bunyan');
const fs = require('fs');

/**
 * @name Constructor
 * @description this is the constructor of the Logger instance.
 * It allows to set Configuration keys:
 *
 * @param level - (optional) set the level for a single output stream
 * @param name - (required) name of Log
 * @param path - (optional) Specify the file path to which log records are written
 * @param src - (optional - default false). Set true to enable 'src' automatic
 *        field with log call source info
 * @returns Object<Logger>
 */
module.exports = ({ level = 'info', name, path = '', src = false }) => {
  let result;
  if (!name) {
    throw new TypeError('`name` is a required option');
  }
  // checks if paths exists
  if (path !== '' && !fs.existsSync(path)) {
    try {
      fs.mkdirSync(path);
    } catch (error) {
      throw new TypeError('failed to create log file with this path!');
    }
  }
  // path is not a string
  const options = {
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
        level,
        path: nodePath.join(path, `${name}.log`),
      },
    ],
  };

  try {
    result = createLogger(options);
  } catch (error) {
    throw error;
  }

  return result;
};
