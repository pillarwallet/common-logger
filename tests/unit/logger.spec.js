const { createLogger } = require('bunyan');
const rimraf = require('rimraf');
const responseTime = require('response-time');
const buildLogger = require('../../lib/logger');

jest.mock('bunyan');
jest.mock('response-time');

const getMockFirstCall = spy => spy.mock.calls[0][0];
const randomFilename = () => `foo-${Math.floor(Math.random() * 999999 + 1)}`;

describe('Common Logger', () => {
  const path = 'logs/';
  createLogger.mockImplementation(options =>
    require.requireActual('bunyan').createLogger(options),
  );

  afterEach(() => {
    createLogger.mockClear();
  });

  afterAll(() => {
    jest.restoreAllMocks();
    rimraf(path, () => {});
  });

  it('returns a logger', () => {
    expect.assertions(4);
    const logger = buildLogger({ name: randomFilename(), path });

    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.fatal).toBe('function');
    expect(typeof logger.warn).toBe('function');
  });

  describe('Streams functionality', () => {
    let streams;

    beforeEach(() => {
      buildLogger({ name: randomFilename(), path });
      ({ streams } = getMockFirstCall(createLogger));
    });

    it('sets a console stream', () => {
      expect(streams).toEqual(
        expect.arrayContaining([{ level: 'info', stream: process.stdout }]),
      );
    });

    it('sets a file stream', () => {
      expect(streams[1].type).toEqual('raw');
    });
  });

  describe('Configuration functionality', () => {
    it('allows configurable log level (default is info)', () => {
      let logger;
      expect.assertions(2);

      logger = buildLogger({ name: randomFilename(), path });
      expect(logger.streams[0].level).toBe(30);

      logger = buildLogger({ name: randomFilename(), path, level: 'error' });
      expect(logger.streams[0].level).toBe(50);
    });

    it('allows configurable src (default is false)', () => {
      let logger;
      expect.assertions(2);

      logger = buildLogger({ name: randomFilename(), path });
      expect(logger.src).toBe(false);

      logger = buildLogger({ name: randomFilename(), path, src: true });
      expect(logger.src).toBe(true);
    });

    it('allows configurable file name', () => {
      const name = randomFilename();
      const logger = buildLogger({ name, path });

      expect(logger.fields.name).toEqual(name);
    });

    it('allows custom serialisers', () => {
      const logger = buildLogger({ name: randomFilename(), path });
      expect.assertions(3);

      expect(logger.serializers).toHaveProperty('err');
      expect(logger.serializers).toHaveProperty('req');
      expect(logger.serializers).toHaveProperty('res');
    });
  });

  describe('Possible errors', () => {
    it('the constructor does not have `name` param', () => {
      expect(() => buildLogger({ path })).toThrowError(
        new TypeError('`name` is a required option'),
      );
    });

    it('throws a TypeError when the path is not writeable', () => {
      expect(() =>
        buildLogger({
          name: randomFilename(),
          path: '#@__|/±§":;?><.,`~*&^%$#@™£¢§§ˆˆ•ªº',
        }),
      ).toThrowError(
        new TypeError(
          'Failed to create log file with this path (#@__|/±§":;?><.,`~*&^%$#@™£¢§§ˆˆ•ªº): ENOENT: no such file or directory, mkdir \'#@__|/±§":;?><.,`~*&^%$#@™£¢§§ˆˆ•ªº\'',
        ),
      );
    });

    it('throws a TypeError when constructor options object are not correct', () => {
      expect(() =>
        buildLogger({
          name: randomFilename(),
          path,
          level: 'Gavin level',
        }),
      ).toThrowError('unknown level name: "Gavin level"');
    });
  });

  describe('HTTP request middleware Logger', () => {
    it('checks if logger have middleware function', () => {
      const logger = buildLogger({ name: randomFilename(), path });
      expect(logger).toHaveProperty('middleware');
      expect(typeof logger.middleware).toBe('function');
    });

    it('expects logger middleware to be called with req/res properties', () => {
      const logger = buildLogger({ name: randomFilename(), path });
      logger.middleware();
      expect(responseTime).toHaveBeenCalledTimes(1);
    });
  });
});
