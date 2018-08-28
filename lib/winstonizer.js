const winston = require('winston');
require('winston-syslog').Syslog; // eslint-disable-line no-unused-expressions

let winstonLogger;

/**
 * @name constructTransports
 * @description Builds an array of transports from a
 * list of desired transports. This function will try
 * to fulfil the request and cycle through the array
 * and match transports.
 *
 * @param {Array} desiredTransports
 * @returns {Array} constructedTransports
 */
const constructTransports = desiredTransports => {
  const constructedTransports = [];

  /**
   * Attempt to test for an array type
   * before continuing.
   */
  if (desiredTransports.constructor !== Array) {
    throw new Error(
      'The first parameter must be an array of desired transports.',
    );
  }

  /**
   * If the desiredTransports is an Array, ensure
   * that there are elements inside the array.
   */
  if (desiredTransports.length === 0) {
    throw new Error('The array must contain at least 1 or more elements');
  }

  /**
   * Cycle through the arary and attempt to match
   * a transport for each transport type
   */
  desiredTransports.forEach(transport => {
    if (!transport.type) {
      // We need at least a type. If it does not exist,
      // simply stop processing this iteration.
      return;
    }

    /**
     * Switch on transport type
     */
    switch (transport.type.toLowerCase()) {
      case 'console':
        constructedTransports.push(
          new winston.transports.Console(transport.options),
        );
        break;

      case 'file':
        constructedTransports.push(
          new winston.transports.File(transport.options),
        );
        break;

      case 'syslog':
        constructedTransports.push(
          new winston.transports.Syslog(transport.options),
        );
        break;

      default:
        // Ignore anything else.
        break;
    }
  });

  /**
   * Finally, return an array of constructed transports,
   * which also may be an ampty array.
   */
  return constructedTransports;
};

/**
 * @name build
 * @description Main entrypoint function to build and return
 * a derived logger instance from Winston.
 * @param {Object} configuration
 * @param {Array} desiredTransports
 */
const build = (
  configuration = {},
  desiredTransports = [{ type: 'Console' }],
) => {
  /**
   * Setup scaffolding object for the
   * rest of the function to utilise.
   */
  const intermediaryConfiguration = {
    transports: [],
  };

  /**
   * Call the constructTransports method with the
   * incoming desired transports array.
   */
  const constructedTransports = constructTransports(desiredTransports);

  /**
   * Create a new object called finalConfiguration, merging
   * the intermediaryConfiguration, constructed transports
   * and the incoming configuration object, if any.
   */
  const finalConfiguration = Object.assign(
    intermediaryConfiguration,
    {
      transports: constructedTransports,
    },
    configuration,
  );

  /**
   * Create an instance of a derived logger from Winston,
   * using the finalConfiguration object build from the
   * previous methods.
   */
  winstonLogger = winston.createLogger(finalConfiguration);

  /**
   * Return the derived logger.
   */
  return winstonLogger;
};

/**
 * Export.
 */
module.exports = {
  build,
  constructTransports,
};
