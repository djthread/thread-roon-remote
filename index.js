let mpd = require('mpd'),
  cmd,
  joystick = new (require('joystick'))(0, 3500, 350),
  RoonApi = require('node-roon-api'),
  RoonApiSettings = require('node-roon-api-settings'),
  RoonApiStatus = require('node-roon-api-status'),
  RoonApiTransport = require('node-roon-api-transport');

const { exec } = require('child_process');

let core,
  zone = '160115e8162dfe46cdcd8ea578ecefa359a3', // JukePi Hugo2
  mode = 'roon'; // 'roon' or 'mpd'

var client = mpd.connect({port: 6600, host: 'localhost'})
client.on('ready', function() {
  console.log('mpd ready');
  cmd = mpd.cmd;
});

var roon = new RoonApi({
  extension_id:       'com.threadbox.rune-remote',
  display_name:       "Thread's Roon Remote",
  display_version:    '1.0.0',
  publisher:          'Thread',
  email:              'thethread@gmail.com',
  website:            'https://threadbox.net/',

  core_paired: function(core_) {
    console.log("PAIRED");
    core = core_;

    // core.services.RoonApiTransport.subscribe_zones(function(cmd, data) {
    //   console.log("ZONES SUBSCRIBED");
    //   console.log(core.core_id,
    //     core.display_name,
    //     core.display_version,
    //     "-",
    //     cmd,
    //     JSON.stringify(data, null, '  '));
    // });
  },

  core_unpaired: function(core_) {
    core = undefined;

    // console.log("UNPAIRED");
    // console.log(core.core_id,
    //   core.display_name,
    //   core.display_version,
    //   "-",
    //   "LOST");
    }
});

var svc_status = new RoonApiStatus(roon);

roon.init_services({
  required_services: [ RoonApiTransport ],
  provided_services: [ svc_status ],
});

svc_status.set_status('All is good', false);


joystick.on('button', (ev) => {
  // there must be a connected core, and the button must be pressed
  // down (not released)
  if (!core || ev.value == 0) return;

  const trans = core.services.RoonApiTransport;

  switch (ev.number) {
    case 9: // start
      console.log('Button 0 - previous');
      switch (mode) {
        case 'roon': trans.control(zone, 'previous'); break;
        case 'mpd': cmd('previous', []); break;
      }
      break;
    case 0: // b
      console.log('Button 1 - playpause');
      switch (mode) {
        case 'roon': trans.control(zone, 'playpause'); break;
        case 'mpd': cmd('pause', []); break;
      }
      break;
    case 1: // a
      console.log('Button 2 - next');
      switch (mode) {
        case 'roon': trans.control(zone, 'next'); break;
        case 'mpd': cmd('next', []); break;
      }
      break;
    case 8: // select
      console.log('sutting down...');
      exec("shutdown -h now");
      break;
    default:
      console.log('UNMAPPED BUTTON EVENT', ev);
  }
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
});

joystick.on('axis', (ev) => {
  // there must be a connected core, and the button must be pressed
  // down (not released)
  if (!core || ev.value == 0) return;

  const trans = core.services.RoonApiTransport;

  switch (ev.number) {
    case 0:
      if (ev.value < 0) { // left
        console.log('seeking backwards');
        switch (mode) {
          case 'roon': trans.seek(zone, 'relative', -30); break;
          case 'mpd': cmd('seekcur', ['-30']); break;
        }
      } else if (ev.value > 0) { // right
        console.log('seeking forwards');
        switch (mode) {
          case 'roon': trans.seek(zone, 'relative', 30); break;
          case 'mpd': cmd('seekcur', ['+30']); break;
        }
      }
      break;
    case 1:
      if (ev.value < 0) { // up - toggle mode
        if (mode == 'roon') {
          core.services.RoonApiTransport.control('stop');
          mode = 'mpd';
        } else if (mode == 'mpd') {
          cmd('stop', [])
          mode = 'roon';
        }
      } else if (ev.value > 0) { // down
      }
      break;
    default:
      console.log('UNMAPPED AXIS EVENT', ev);
  }
});

roon.start_discovery();
