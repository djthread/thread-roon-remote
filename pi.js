// For my Raspberry Pi
//
const log = require('./lib/log'),
  mpd = require('./lib/mpd'),
  ashuffle = require('./lib/ashuffle'),
  roon = require('./lib/roon'),
  myJoystick = require('./lib/my.joystick'),
  joystick = require('./lib/joystick'),
  actions = require('./lib/actions'),
  fs = require('fs');

// JukePi Hugo2 zone
// const zone = '160115e8162dfe46cdcd8ea578ecefa359a3';
// JukePi Hugo2 output
// const output = '170115e8162dfe46cdcd8ea578ecefa359a3';

const output = fs.readFileSync("zone_id", "utf8").trim();

let initial = true;
mpd.connect();
roon.start("Thread's Pi Roon Remote", output, () => {
  if (initial) {
    roon.control('play');
    // initial = false;
  }
});

joystick.start();
joystick.subscribe((btn) => {
  let action = myJoystick.btnToAction(btn);
  actions.run(action, roon, mpd, ashuffle);
});
