const bunyan = require('bunyan');
const bformat = require('bunyan-format');

const formatOut = bformat({ outputMode: 'short' });

const log = bunyan.createLogger({
  name: 'invoice',
  level: process.env.LOG || 'info',
  stream: formatOut,
});

function debug(message) {
  log.debug(message);
}

function info(message) {
  log.info(message);
}

function warn(message, e) {
  log.warn(message, e);
}

function error(message, e) {
  log.error(message, e);
}

exports = module.exports = {
  debug,
  info,
  warn,
  error,
};
