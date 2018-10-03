const log4js = require('log4js');

const logger = log4js.getLogger('syslog');

logger.buildConfiguration = filename => {
  log4js.configure({
    appenders: {
      out: { type: 'console' },
      default: {
        type: 'file',
        filename: `${filename}.log`,
      },
    },
    categories: {
      default: { appenders: ['out', 'default'], level: 'ALL' },
    },
  });
};

module.exports = logger;
