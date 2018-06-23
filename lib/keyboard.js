// Maps key presses to actions
// thank you http://thisdavej.com/making-interactive-node-js-console-apps-that-listen-for-keypress-events/
const log = require('./log');
const readline = require('readline');


const start = () => {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
};

const btn = (key, cb) => {
  log.debug(`key: ${key}`);
  if (cb) cb(key);
}

const registerCb = (cb) => {
  process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
      process.exit();
    } else {
      btn(str, cb);
    }
  });
};

module.exports = {
  start: start,

  subscribe: (cb) => {
    registerCb(cb);
  }
};
