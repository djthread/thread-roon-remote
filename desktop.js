// For my Desktop
//
const log = require('./lib/log'),
  mpd = require('./lib/mpd'),
  ashuffle = require('./lib/ashuffle'),
  roon = require('./lib/roon'),
  joystick = require('./lib/joystick'),
  myJoystick = require('./lib/my.joystick'),
  web = require('./lib/web'),
  actions = require('./lib/actions'),
  fs = require('fs');

// JukePi Hugo2 zone
// const zone = '160115e8162dfe46cdcd8ea578ecefa359a3';
// JukePi Hugo2 output
// const output = '170115e8162dfe46cdcd8ea578ecefa359a3';
// System Output
// const output = '16016854f660685ce8fb918b4f605a43fe2c';

const output = fs.readFileSync("zone_id");

if (!output) {
  raise('No zone_id found!');
}

log.info(`Connecting to zone ${output}...`);

// mpd.connect();

roon.start("Thread's Desktop Roon Remote", output, () => {
  log.info('Connected.');
});

web.start();
web.subscribe((action) => {
  actions.run(action, roon, mpd, ashuffle);
});

// joystick.start();
// joystick.subscribe((btn) => {
//   let action = myJoystick.btnToAction(btn);
//   actions.run(action, roon, mpd, ashuffle);
// });
