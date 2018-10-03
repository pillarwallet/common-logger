/* eslint no-underscore-dangle: 0 */

const log4js = require('log4js');
const logger = require('../../index');

describe('The Logger Module', () => {
  const configureLoggerSpy = jest.spyOn(log4js, 'configure');

  afterEach(() => {
    log4js.configure.mockClear();
  });

  it('should have called log4js.configure function', () => {
    logger.buildConfiguration();

    expect(configureLoggerSpy).toHaveBeenCalled();
  });

  it('should have called log4js.configure function with params', () => {
    logger.buildConfiguration('./tests/unit/logs/myProj1');

    expect(configureLoggerSpy).toHaveBeenCalledWith({
      appenders: {
        out: { type: 'console' },
        default: {
          type: 'file',
          filename: './tests/unit/logs/myProj1.log',
        },
      },
      categories: {
        default: { appenders: ['out', 'default'], level: 'ALL' },
      },
    });
  });
});
