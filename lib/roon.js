const RoonApi = require('node-roon-api'),
  RoonApiSettings = require('node-roon-api-settings'),
  RoonApiStatus = require('node-roon-api-status'),
  RoonApiTransport = require('node-roon-api-transport'),
  log = require('./log');

let roon, core;

module.exports = {
  roon: () => { return roon; },
  core: () => { return core; },
  trans: () => { return core ? core.trans : null; },

  start: (zone) => {
    roon = new RoonApi({
      extension_id:       'com.threadbox.rune-remote',
      display_name:       "Thread's Roon Remote",
      display_version:    '1.0.0',
      publisher:          'Thread',
      email:              'thethread@gmail.com',
      website:            'https://threadbox.net/',

      core_paired: function(core_) {
        core = core_;

        log.info('PAIRED, pressing play..');

        core.services.RoonApiTransport.control(zone, 'play');

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

    roon.start_discovery();
  }
};