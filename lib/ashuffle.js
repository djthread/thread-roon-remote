const log = require('./log'),
  { spawn } = require('child_process');

let proc;

module.exports = {
  start: () => {
    log.info('starting ashuffle...');
    proc = spawn('ashuffle', [], {stdio: 'inherit'});
  },

  stop: () => {
    log.info('stopping ashuffle...');
    proc.kill();
  }
};