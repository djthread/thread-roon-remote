// For my Sparky / USBRidge
//
const log = require('./lib/log'),
  // mpd = require('./lib/mpd'),
  // ashuffle = require('./lib/ashuffle'),
  roon = require('./lib/roon'),
  mySweet16 = require('./lib/keybaord.sweet16'),
  keyboard = require('./lib/keyboard'),
  actions = require('./lib/actions');

// JukePi Hugo2 zone
// const zone = '160115e8162dfe46cdcd8ea578ecefa359a3';
// JukePi Hugo2 output
const output = '170115e8162dfe46cdcd8ea578ecefa359a3';

let initial = true;
// mpd.connect();
roon.start("Thread's Pi Roon Remote", output, () => {
  if (initial) {
    roon.control('play');
    // initial = false;
  }
});

joystick.start();
joystick.subscribe((btn) => {
  let action = myJoystick.btnToAction(btn);
  actions.run(action, roon, null, ashuffle);
});