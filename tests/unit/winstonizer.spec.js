const winston = require('winston');
const winstonizer = require('../../lib/winstonizer');

// jest.mock('winston');
// jest.mock('../../lib/winstonizer');

describe('The Winstonizer Module', () => {
  describe('construct function', () => {
    it('should have called winston.createLogger function', () => {
      const derivedLogger = winstonizer.build();
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

    it('should NOT throw an error if array passed into the first parameter', () => {
      expect(() => {
        winstonizer.constructTransports([
          {
            type: 'Console',
          },
          {
            type: 'File',
          },
        ]);
      }).not.toThrowError();
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

    it('should return just an empty array if an array of empty objects specified', () => {
      const transports = winstonizer.constructTransports([{}, {}, {}]);

      expect(transports).toEqual([]);
    });
  });
});
