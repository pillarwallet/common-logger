const { createLogger } = require('bunyan');
const buildLogger = require('../../lib/logger');

jest.mock('bunyan');

const getMockFirstCall = spy => spy.mock.calls[0][0];

describe('Common Logger', () => {
  createLogger.mockImplementation(options =>
    require.requireActual('bunyan').createLogger(options),
  );

  afterEach(() => {
    createLogger.mockClear();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('returns a logger', () => {
    expect.assertions(4);
    const logger = buildLogger({ name: 'foo' });

    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.fatal).toBe('function');
    expect(typeof logger.warn).toBe('function');
  });

  describe('streams', () => {
    let streams;

    beforeEach(() => {
      buildLogger({ name: 'foo' });
      ({ streams } = getMockFirstCall(createLogger));
    });

    it('sets a console stream', () => {
      expect(streams).toEqual(
        expect.arrayContaining([{ level: 'info', stream: process.stdout }]),
      );
    });

    it('sets a file stream', () => {
      expect(streams).toEqual(
        expect.arrayContaining([{ level: 'info', path: 'foo.log' }]),
      );
    });
  });

  describe('configuration', () => {
    it('allows configurable log level (default is info)', () => {
      expect.assertions(2);
      let logger = buildLogger({ name: 'foo' });
      expect(logger.streams[0].level).toBe(30);
      logger = buildLogger({ name: 'foo', level: 'error' });
      expect(logger.streams[0].level).toBe(50);
    });

    it('allows configurable src (default is false)', () => {
      expect.assertions(2);
      let logger = buildLogger({ name: 'foo' });
      expect(logger.src).toBe(false);
      logger = buildLogger({ name: 'foo', src: true });
      expect(logger.src).toBe(true);
    });

    it('allows configurable file path', () => {
      const logger = buildLogger({ name: 'foo', path: 'logs/' });
      expect(logger.streams[1].path).toBe('logs/foo.log');
    });

    it('allows custom serialisers', () => {
      expect.assertions(3);
      const logger = buildLogger({ name: 'foo', path: 'logs/' });
      expect(logger.serializers).toHaveProperty('err');
      expect(logger.serializers).toHaveProperty('req');
      expect(logger.serializers).toHaveProperty('res');
    });
  });

  describe('possible errors', () => {
    // needs a test, or only documentation
    it('constructor does not have `name` param', () => {
      expect(() => buildLogger({})).toThrowError(
        new TypeError('`name` is a required option'),
      );
    });

    it('path is not right', () => {
      expect(() =>
        buildLogger({
          name: 'foo',
          path: '#@__|/±§":;?><.,`~*&^%$#@™£¢§§ˆˆ•ªº',
        }),
      ).toThrowError(
        new TypeError('failed to create log file with this path!'),
      );
    });

    it('constructor options object is not correct', () => {
      expect(() =>
        buildLogger({
          name: 'foo',
          path: 'logs/',
          level: 'Gavin level',
        }),
      ).toThrowError(new TypeError('unknown level name: "Gavin level"'));
    });
  });
});
