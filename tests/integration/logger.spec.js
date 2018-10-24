const concatPath = require('path');
const readLastLines = require('read-last-lines');
const express = require('express');
const superTest = require('supertest');
const buildLogger = require('../../index');

const getLogFile = path =>
  new Promise(resolve =>
    setTimeout(() => resolve(readLastLines.read(path, 1)), 500),
  );

describe('Common Logger', () => {
  const path = concatPath.join(__dirname, '/logs');
  const logger = buildLogger({
    name: 'logTest',
    path,
  });

  it('should log to a file', async () => {
    logger.info('Logger Info Test!');
    const lastLog = await getLogFile(`${path}/logTest.log`);
    expect(lastLog).toMatch('logTest');
    expect(lastLog).toMatch('Logger Info Test!');
  });

  it('should test serializer', async () => {
    const req = {
      log: 'serializer',
      type: 'oneType',
      criticalLevel: 3,
    };

    logger.info(req, 'Logger serializer Test!');
    const lastLog = await getLogFile(`${path}/logTest.log`);
    expect(lastLog).toMatch('criticalLevel');
    expect(lastLog).toMatch('Logger serializer Test!');
    expect(lastLog).toMatch('serializer');
  });

  describe('middleware', () => {
    const app = express();
    app.use(logger.middleware());
    app.use('/', (req, res) => {
      res.send('Hello');
    });

    const server = app.listen(3000);
    const request = superTest(server);

    afterAll(done => {
      server.close(() => done);
    });

    it('should append log file with http request serializer', async () => {
      await request.get('/');

      const lastLog = await getLogFile(`${path}/logTest.log`);
      expect(lastLog).toMatch('"msg":"HTTP REQUEST"');
      expect(lastLog).toMatch('"method":"GET",');
      expect(lastLog).toMatch('"responseTime"');
    });

    it('checks if logger info is being called with http request serializer', async () => {
      jest.spyOn(logger, 'info');

      await request.get('/');

      expect(logger.info).toHaveBeenCalledWith(
        {
          method: 'GET',
          responseTime: expect.any(String),
          statusCode: 200,
          url: '/',
        },
        'HTTP REQUEST',
      );
    });
  });
});
