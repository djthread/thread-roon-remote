const joystick = new (require('joystick'))(0, 3500, 350),
  log = require('./log');

const btn = (btn, cb) => {
  log.debug(`btn: ${btn}`);
  cb('btn');
};

module.exports = {
  subscribe: (cb) => {
    joystick.on('button', (ev) => {
      switch (ev.number) {
        case 9: // start
          btn('start', cb);
          break;
        case 0: // b
          btn('b');
          break;
        case 1: // a
          btn('a');
          break;
        case 8: // select
          btn('select');
          break;
        default:
          log.debug('UNMAPPED', ev)
      }
    });

    joystick.on('axis', (ev) => {
      switch (ev.number) {
        case 0:
          if (ev.value < 0) { // left
            btn('left');
          } else if (ev.value > 0) { // right
            btn('right');
          }
          break;
        case 1:
          if (ev.value < 0) { // up - toggle mode
            btn('up');
          } else if (ev.value > 0) { // down
            btn('down');
          }
          break;
        default:
          log.debug('UNMAPPED', ev);
      }
    });
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
