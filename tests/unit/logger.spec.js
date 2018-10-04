const { createLogger } = require('bunyan');
const bunyanner = require('../../lib/logger');

jest.mock('bunyan');

const getMockFirstCall = spy => spy.mock.calls[0][0];

describe('Common Logger', () => {
  // jest.spyOn(bunyan, 'createLogger');
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
    const logger = bunyanner({ name: 'foo' });
    // console.log(Object.keys(l.prototype));
    // console.log(l.info);
    // expect(typeof logger).toBe('object');
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
  });

  it('creates a logger at info level by default', () => {
    bunyanner({ name: 'foo' });
    expect(createLogger).toBeCalledWith(
      expect.objectContaining({ level: 'info' }),
    );
  });

  it('defaults to src: true', () => {
    bunyanner({ name: 'foo' });
    // console.log(createLogger.mock.calls.length);
    expect(createLogger).toBeCalledWith(expect.objectContaining({ src: true }));
  });

  it('defaults path');

  describe('streams', () => {
    let streams;

    beforeEach(() => {
      bunyanner({ name: 'foo' });
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
    it('requires a name', () => {
      expect(() => bunyanner({})).toThrowError(
        new TypeError('`name` is a required option'),
      );
    });

    // it('defaults src: true');
    it('allows configurable log level (default is info)');

    it('allows configurable src (default is true)');

    it('allows configurable file path');

    it('allows custom serialisers');

    // only logs to console in dev env?
  });

  describe('request parsing', () => {
    it('extends default `req` serialiser'); // correlationId

    it('method');

    it('path');

    it('correlation ID');
  });

  describe('err parsing', () => {
    // needs a test, or only documentation
  });

  describe('logging', () => {
    // maybe integration
    // level
    // path
    // timestamp
    // hostname
    // pid
    // ...

    it('user level set in config');

    it('includes src');

    it('uses custom serialisers');

    it('logs to custom path'); // maybe integration...
  });
});
