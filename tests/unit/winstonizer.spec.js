/* eslint no-underscore-dangle: 0 */

const winston = require('winston');
const winstonizer = require('../../lib/winstonizer');

describe('The Winstonizer Module', () => {
  describe('build function', () => {
    it('should have called winston.createLogger function', () => {
      const winstonCreateLoggerSpy = jest.spyOn(winston, 'createLogger');
      winstonizer.build();

      expect(winstonCreateLoggerSpy).toHaveBeenCalled();
    });

    it('should have returned an instance of DerivedLogger', () => {
      const logger = winstonizer.build();

      expect(logger.constructor.name).toBe('DerivedLogger');
    });

    it('should have returned an instance of DerivedLogger with custom configuration', () => {
      const desiredConfiguration = {
        level: 'error',
        silent: true,
        exitOnError: true,
      };
      const logger = winstonizer.build(
        [
          {
            type: 'Console',
          },
        ],
        desiredConfiguration,
      );

      expect(logger.constructor.name).toBe('DerivedLogger');

      // Test with given configuration options
      expect(logger.level).toBe(desiredConfiguration.level);
      expect(logger.silent).toBe(desiredConfiguration.silent);
      expect(logger.exitOnError).toBe(desiredConfiguration.exitOnError);
    });

    it('should returned an instance of DerivedLogger with console as a default transport', () => {
      const logger = winstonizer.build();

      expect(logger.constructor.name).toBe('DerivedLogger');
      expect(logger._readableState.pipes.constructor.name).toBe('Console');
    });

    it('should returned an instance of DerivedLogger with more than one transport with options', () => {
      const desiredTransports = [
        {
          type: 'Console',
          options: {
            level: 'debug',
          },
        },
        {
          type: 'File',
          options: {
            level: 'silly',
            filename: './logs/silly.log',
          },
        },
        {
          type: 'Syslog',
          options: {
            host: 'https://syslogingest.com',
            port: 8888,
            app_name: 'logger-test',
          },
        },
      ];
      const splitFilename = desiredTransports[1].options.filename.split('/');
      const logger = winstonizer.build(desiredTransports);

      expect(logger.constructor.name).toBe('DerivedLogger');

      // Test console with given options
      expect(logger._readableState.pipes[0].constructor.name).toBe('Console');
      expect(logger._readableState.pipes[0].level).toBe(
        desiredTransports[0].options.level,
      );

      // Test File with given options
      expect(logger._readableState.pipes[1].constructor.name).toBe('File');
      expect(logger._readableState.pipes[1].level).toBe(
        desiredTransports[1].options.level,
      );
      expect(logger._readableState.pipes[1].filename).toBe(splitFilename[2]);
      expect(logger._readableState.pipes[1].dirname).toBe(
        `${splitFilename[0]}/${splitFilename[1]}`,
      );

      // Test Syslog with given options
      expect(logger._readableState.pipes[2].host).toBe(
        desiredTransports[2].options.host,
      );
      expect(logger._readableState.pipes[2].port).toBe(
        desiredTransports[2].options.port,
      );
      expect(logger._readableState.pipes[2].appName).toBe(
        desiredTransports[2].options.app_name,
      );
    });
  });

  describe('constructTransports function', () => {
    it('should throw an error if no array passed into the first parameter', () => {
      expect(() => {
        winstonizer.constructTransports();
      }).toThrowError();
    });

    it('should throw an error if an empty array passed into the first parameter', () => {
      expect(() => {
        winstonizer.constructTransports([]);
      }).toThrowError();
    });

    it('should throw an error if a non-array passed into the first parameter', () => {
      expect(() => {
        winstonizer.constructTransports('String');
      }).toThrowError();
    });

    it('should NOT throw an error if array passed into the first parameter', () => {
      expect(() => {
        winstonizer.constructTransports([
          {
            type: 'Console',
          },
          {
            type: 'File',
            options: {
              level: 'silly',
              filename: './logs/silly.log',
            },
          },
        ]);
      }).not.toThrowError();
    });

    it('should NOT throw an error if using Syslog', () => {
      winston.transports.Syslog = jest.fn();
      expect(() => {
        winstonizer.constructTransports([
          {
            type: 'Syslog',
          },
        ]);
      }).not.toThrowError();

      expect(winston.transports.Syslog).toHaveBeenCalled();
    });

    it('should return a Winston Console transport when "console" specified', () => {
      const transports = winstonizer.constructTransports([
        {
          type: 'Console',
          options: {},
        },
      ]);
      const transportToAssert = JSON.stringify(transports[0]);
      const transportExpected = JSON.stringify(
        new winston.transports.Console(),
      );

      expect(transportToAssert).toEqual(transportExpected);
    });

    it('should ignore other transport types and return an empty array', () => {
      const transports = winstonizer.constructTransports([
        {
          type: 'Mordor',
          options: {
            location: 'Middle Earth',
            duration: 4,
            unit: 'Hours',
          },
        },
      ]);

      const transportExpected = [];

      expect(transports).toEqual(transportExpected);
    });

    it('should return just an empty array if an array of empty objects specified', () => {
      const transports = winstonizer.constructTransports([{}, {}, {}]);

      expect(transports).toEqual([]);
    });
  });
});
