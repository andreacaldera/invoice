var npid = require('npid');
var log = require('./log');
var fs = require('fs');

var pidFile = './invoice.pid';

function start() {
    try {
        // TODO don't do this if running id dev mode
        var pid = npid.create(pidFile);
        pid.removeOnExit();
    } catch (error) {
        log.error('Unable to create pid', error);
        // TODO process.exit(1);
    }
}

function stop() {
    fs.unlinkSync(pidFile);
}

exports = module.exports = {
    start: start,
    stop: stop
}