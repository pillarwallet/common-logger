const bunyanner = require('../../lib/logger');

describe('Common Logger', () => {
  it('logs to a file', () => {
    const logger = bunyanner({ name: 'int', path: __dirname });
    logger.info('Super cool!');
  });
});
