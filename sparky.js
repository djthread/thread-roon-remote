// For my Sparky / USBRidge
//
const fs = require('fs'),
   log = require('./lib/log'),
  // mpd = require('./lib/mpd'),
  // ashuffle = require('./lib/ashuffle'),
  roon = require('./lib/roon'),
  mySweet16 = require('./lib/keyboard.sweet16'),
  keyboard = require('./lib/keyboard'),
  actions = require('./lib/actions');

// JukePi Hugo2 zone
// const zone = '160115e8162dfe46cdcd8ea578ecefa359a3';
// JukePi Hugo2 output
// const output = '170115e8162dfe46cdcd8ea578ecefa359a3';
// Sparky / USBridge Hugo2
// const output = '16013e61fba2fb9d85fdcac3b7b23776669c';
const output = fs.readFileSync("zone_id", "utf8").trim();

let initial = true;
// mpd.connect();
roon.start("Thread's Sparky Roon Remote", output, () => {
  if (initial) {
    roon.control('play');
    // initial = false;
  }
});

keyboard.start();
keyboard.subscribe((btn) => {
  let action = mySweet16.btnToAction(btn);
  actions.run(action, roon, null, null);
});
