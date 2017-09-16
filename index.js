let joystick = new (require('joystick'))(0, 3500, 350),
  RoonApi        = require('node-roon-api'),
  RoonApiSettings  = require('node-roon-api-settings'),
  RoonApiStatus    = require('node-roon-api-status'),
  RoonApiTransport = require('node-roon-api-transport');

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
    case 0:
      console.log('Button 0 - previous');
      core.services.RoonApiTransport.control(zone, 'previous');
      break;
    case 1:
      console.log('Button 1 - playpause');
      core.services.RoonApiTransport.control(zone, 'playpause');
      break;
    case 2:
      console.log('Button 2 - next');
      core.services.RoonApiTransport.control(zone, 'next');
      break;
    default:
      console.log('UNMAPPED JOYSTICK EVENT', ev);
  }
  // { time: 37560, value: 1, number: 3, type: 'button', id: 0 }
  // { time: 37660, value: 1, number: 2, type: 'button', id: 0 }
  // { time: 37730, value: 0, number: 3, type: 'button', id: 0 }
});

roon.start_discovery();
