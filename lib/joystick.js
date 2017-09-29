const log = require('./log'),
  joystick_lib = require('joystick');

let joystick, subscribeFn, timeout;

const start = () => {
  joystick = new joystick_lib(0, 3500, 350);
  registerCb(subscribeFn);
};

const btn = (btn, cb) => {
  log.debug(`btn: ${btn}`);
  if (cb) cb(btn);
};

const registerCb = (cb) => {
  joystick.on('button', (ev) => {
    if (ev.value == 0) return;

    switch (ev.number) {
      case 9: btn('start', cb); break;
      case 0: btn('b', cb); break;
      case 1: btn('a', cb); break;
      case 8: btn('select', cb); break;
      default: log.debug('UNMAPPED:', ev)
    }
  });

  joystick.on('axis', (ev) => {
    switch (ev.number) {
      case 0:
        if (ev.value < 0) btn('left', cb);
        else if (ev.value > 0) btn('right', cb);
        break;
      case 1:
        if (ev.value < 0) btn('up', cb);
        else if (ev.value > 0) btn('down', cb);
        break;
      default:
        log.debug('UNMAPPED', ev);
    }
  });

  joystick.on('error', (err) => {
    log.error(`joystick error: ${err}`);
    if (timeout) clearTimeout(timeout);
    // timeout = setTimeout(start, 10000);
  });
};

module.exports = {
  start: start,

  subscribe: (cb) => {
    subscribeFn = cb;
    if (joystick) {
      registerCb(subscribeFn);
    }
  }
};

// { time: .., value: 1, number: 1, type: 'button', id: 0 } # a
// { time: .., value: 0, number: 1, type: 'button', id: 0 }
// { time: .., value: 1, number: 0, type: 'button', id: 0 } # b
// { time: .., value: 0, number: 0, type: 'button', id: 0 }
// { time: .., value: 1, number: 9, type: 'button', id: 0 } #start
// { time: .., value: 0, number: 9, type: 'button', id: 0 }
// { time: .., value: 1, number: 8, type: 'button', id: 0 } #select
// { time: .., value: 0, number: 8, type: 'button', id: 0 }
// { time: .., value: -32767, number: 1, type: 'axis', id: 0 } #up
// { time: .., value: 0, number: 1, type: 'axis', id: 0 }
// { time: .., value: 32767, number: 1, type: 'axis', id: 0 } #down
// { time: .., value: 0, number: 1, type: 'axis', id: 0 }
// { time: .., value: -32767, number: 0, type: 'axis', id: 0 }#left
// { time: .., value: 0, number: 0, type: 'axis', id: 0 }
// { time: .., value: 32767, number: 0, type: 'axis', id: 0 }#right
// { time: .., value: 0, number: 0, type: 'axis', id: 0 }
