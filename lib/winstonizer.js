const winston = require('winston');

let winstonLogger;

const constructTransports = desiredTransports => {
  const constructedTransports = [];

  if (desiredTransports.constructor !== Array) {
    throw new Error(
      'The first parameter must be an array of desired transports.',
    );
  }

  if (desiredTransports.length === 0) {
    throw new Error('The array must contain at least 1 or more elements');
  }

  desiredTransports.forEach(transport => {
    if (!transport.type) {
      // We need at least a type. If it does not exist,
      // simply stop processing this iteration.
      return;
    }

    switch (transport.type.toLowerCase()) {
      case 'console':
        constructedTransports.push(
          new winston.transports.Console(transport.options),
        );
        break;

      default:
        break;
    }
  });

  return constructedTransports;
};

const build = (
  configuration = {},
  desiredTransports = [{ type: 'Console' }],
) => {
  let finalConfiguration = {
    transports: [],
  };
  const constructedTransports = constructTransports(desiredTransports);

  finalConfiguration = Object.assign(
    finalConfiguration,
    {
      transports: constructedTransports,
    },
    configuration,
  );

  console.log(finalConfiguration);

  winstonLogger = winston.createLogger(finalConfiguration);

  return winstonLogger;
};

module.exports = {
  build,
  constructTransports,
};
