// Maps key presses to actions
// thank you http://thisdavej.com/making-interactive-node-js-console-apps-that-listen-for-keypress-events/
const log = require('./log');
const readline = require('readline');


const start = () => {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
      process.exit();
    } else {
      
    }
  });
};

const btn = (key, cb) => {
  log.debug(`key: ${key}`);
  if (cb) cb(key);
}

const registerCb
