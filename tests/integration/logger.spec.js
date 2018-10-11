const buildLogger = require('../../index');

describe('Common Logger', () => {
  it('should log to a file', () => {
    const logger = buildLogger({ name: 'logTest', path: __dirname });

    logger.info('Logger Info Test!');
    logger.warn('Logger Warn Test!');
    logger.fatal('Logger Fatal Test!');
    logger.error('Logger Error Test!');
  });

  it('should test serializer', () => {
    const logger = buildLogger({ name: 'logSerializer', path: __dirname });

    const req = {
      log: 'serializer',
      type: 'oneType',
      criticalLevel: 3,
    };

    logger.info(req, 'Logger Info Test!');
  });
});
