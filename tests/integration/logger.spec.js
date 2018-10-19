const concatPath = require('path');
const readLastLines = require('read-last-lines');
const buildLogger = require('../../index');

const getLogFile = path => {
  const promise = new Promise(resolve => {
    setTimeout(() => resolve(readLastLines.read(path, 1)));
  });
  return promise;
};

describe('Common Logger', () => {
  const path = concatPath.join(__dirname, '/logs');
  let logger;

  it('should log to a file', async () => {
    logger = buildLogger({
      name: 'logTest',
      path,
    });
    logger.info('Logger Info Test!');
    const lastLog = await getLogFile(`${path}/logTest.log`);
    expect(lastLog).toMatch('logTest');
    expect(lastLog).toMatch('Logger Info Test!');
  });

  it('should test serializer', async () => {
    logger = buildLogger({
      name: 'logSerializer',
      path,
    });

    const req = {
      log: 'serializer',
      type: 'oneType',
      criticalLevel: 3,
    };

    logger.info(req, 'Logger serializer Test!');
    const lastLog = await getLogFile(`${path}/logSerializer.log`);
    expect(lastLog).toMatch('logSerializer');
    expect(lastLog).toMatch('Logger serializer Test!');
    expect(lastLog).toMatch('serializer');
  });

  it('should test middleware', async () => {
    logger = buildLogger({
      name: 'logMiddleware',
      path,
    });

    const req = {
      method: 'GET',
      url: path,
    };
    const res = {
      _header: 'X-Response-Time: 3ms \r\nDate:',
      statusCode: 200,
    };
    const next = () => 'next';

    logger.middleware(req, res, next);
    const lastLog = await getLogFile(`${path}/logMiddleware.log`);
    expect(lastLog).toMatch('"msg":"HTTP REQUEST"');
    expect(lastLog).toMatch('"method":"GET",');
    expect(lastLog).toMatch('"responseTime":"3ms"');
  });
});
