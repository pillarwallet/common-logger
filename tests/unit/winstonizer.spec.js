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
