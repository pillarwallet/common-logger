const nodePath = require('path');
const { createLogger } = require('bunyan');
// const b = require('bunyan');

// console.log('Object.keys(b)');
// console.log(Object.keys(b));

/**
 * TODO
 *
 * log level by name as well/instead of number
 */

module.exports = ({ level = 'info', name, path = '', src = true }) => {
  if (!name) {
    throw new TypeError('`name` is a required option');
  }
  // path is not a string
  const options = {
    level,
    name,
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
  return createLogger(options);
  // return b.createLogger({ name, level });
};
