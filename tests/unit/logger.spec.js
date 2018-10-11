const { createLogger } = require('bunyan');
const buildLogger = require('../../lib/logger');

jest.mock('bunyan');

const getMockFirstCall = spy => spy.mock.calls[0][0];
const randomFilename = () => `foo-${Math.floor(Math.random() * 999999 + 1)}`;

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
    const logger = buildLogger({ name: randomFilename() });

    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.fatal).toBe('function');
    expect(typeof logger.warn).toBe('function');
  });

  describe('Streams functionality', () => {
    let streams;

    beforeEach(() => {
      buildLogger({ name: randomFilename() });
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

      logger = buildLogger({ name: randomFilename() });
      expect(logger.streams[0].level).toBe(30);

      logger = buildLogger({ name: randomFilename(), level: 'error' });
      expect(logger.streams[0].level).toBe(50);
    });

    it('allows configurable src (default is false)', () => {
      let logger;
      expect.assertions(2);

      logger = buildLogger({ name: randomFilename() });
      expect(logger.src).toBe(false);

      logger = buildLogger({ name: randomFilename(), src: true });
      expect(logger.src).toBe(true);
    });

    it('allows configurable file name', () => {
      const name = randomFilename();
      const logger = buildLogger({ name, path: 'logs/' });

      expect(logger.fields.name).toEqual(name);
    });

    it('allows custom serialisers', () => {
      const logger = buildLogger({ name: randomFilename(), path: 'logs/' });
      expect.assertions(3);

      expect(logger.serializers).toHaveProperty('err');
      expect(logger.serializers).toHaveProperty('req');
      expect(logger.serializers).toHaveProperty('res');
    });
  });

  describe('Possible errors', () => {
    // TODO: Needs a test, or only documentation

    it('the constructor does not have `name` param', () => {
      expect(() => buildLogger({})).toThrowError(
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
          path: 'logs/',
          level: 'Gavin level',
        }),
      ).toThrowError('unknown level name: "Gavin level"');
    });
  });
});
