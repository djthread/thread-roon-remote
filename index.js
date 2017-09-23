let joystick = new (require('joystick'))(0, 3500, 350),
  RoonApi        = require('node-roon-api'),
  RoonApiSettings  = require('node-roon-api-settings'),
  RoonApiStatus    = require('node-roon-api-status'),
  RoonApiTransport = require('node-roon-api-transport');

const { exec } = require('child_process');

let core,
  zone = '160115e8162dfe46cdcd8ea578ecefa359a3'; // JukePi Hugo2

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
  if (!core || ev.value != 1) return;

  switch (ev.number) {
    case 9: // start
      console.log('Button 0 - previous');
      core.services.RoonApiTransport.control(zone, 'previous');
      break;
    case 0: // b
      console.log('Button 1 - playpause');
      core.services.RoonApiTransport.control(zone, 'playpause');
      break;
    case 1: // a
      console.log('Button 2 - next');
      core.services.RoonApiTransport.control(zone, 'next');
      break;
    case 8: // select
      exec("shutdown -h now");
      break;
    default:
      console.log('UNMAPPED JOYSTICK EVENT', ev);
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

roon.start_discovery();
