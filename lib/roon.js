const RoonApi = require('node-roon-api'),
  RoonApiSettings = require('node-roon-api-settings'),
  RoonApiStatus = require('node-roon-api-status'),
  RoonApiTransport = require('node-roon-api-transport'),
  log = require('./log');

let roon, core, output;

const go = (verb, fn) => {
  if (core) {
    fn();
  } else {
    log.warn(`trying to ${verb}, but no roon core!`, core);
  }
};

const transport = () => {
  if (core) return core.services.RoonApiTransport;
  else return null;
};

module.exports = {
  // roon: () => { return roon; },

  core: () => { return core; },

  trans: transport,

  control: function() {
    const trans = transport(), args = Array.from(arguments);
    go('control', () => {
      trans.control.apply(trans, [output].concat(args));
    });
  },

  seek: function() {
    const trans = transport(), args = Array.from(arguments);
    go('seek', () => {
      trans.seek.apply(trans, [output].concat(args));
    });
  },

  standby: (cb) => {
    const trans = transport();
    go('standby', () => {
      trans.standby(output, {}, cb);
    })
  },

  start: (name, output_, cb, info_cb, opts) => {
    output = output_;
    opts = opts || [];

    roon = new RoonApi({
      extension_id:       'com.threadbox.rune-remote',
      display_name:       name,
      display_version:    '1.0.0',
      publisher:          'Thread',
      email:              'thethread@gmail.com',
      website:            'https://threadbox.net/',

      // @param {string} desc.log_level - How much logging information to print.
      // "all" for all messages, "none" for no messages, anything else for all
      // messages not tagged as "quiet" by the Roon core.
      log_level: opts.log_level || "none",

      core_paired: function(core_) {
        core = core_;

        if (cb) setTimeout(cb, 500);

        if (info_cb) {
          core.services.RoonApiTransport.subscribe_zones(info_cb);
        }
        // core.services.RoonApiTransport.subscribe_zones(function(cmd, data) {
        //   if (data) {
        //     console.log(data["zones"]);
        //   } else {
        //     console.log("NO ZONES");
        //   }
        //   log.debug('ZONES SUBSCRIBED',
        //     core.core_id, core.display_name, core.display_version, "-",
        //     cmd, JSON.stringify(data, null, '  '));
        // });
      },

      core_unpaired: function(core_) {
        core = undefined;

        // log.debug('UNPAIRED',
        //   core.core_id, core.display_name, core.display_version, "-", "LOST");
      }
    });

    const svc_status = new RoonApiStatus(roon);

    roon.init_services({
      required_services: [ RoonApiTransport ],
      provided_services: [ svc_status ],
    });

    svc_status.set_status('All is good', false);

    roon.start_discovery();
  },
};
