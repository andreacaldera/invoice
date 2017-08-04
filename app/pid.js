const npid = require('npid');
const log = require('./log');
const fs = require('fs');

const pidFile = './invoice.pid';

function start() {
  try {
    // TODO don't do this if running id dev mode
    const pid = npid.create(pidFile);
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
  start,
  stop,
};
