var bunyan = require('bunyan');
var bformat = require('bunyan-format');
var formatOut = bformat({ outputMode: 'short' });

var log = bunyan.createLogger(
    {name: "invoice",
        level: process.env.LOG || 'warn',
        stream: formatOut
    });

function debug(message) {
    log.debug(message);
}

function info(message) {
    log.info(message);
}

function warn(message, error) {
    log.warn(message, error);
}

function error(message) {
    log.error(message);
}

exports = module.exports = {
    debug: debug,
    info: info,
    warn: warn,
    error: error
};