const mpd = require('mpd'),
  log = require('./log');

let client, cmd;

module.exports = {
  connect: () => {
    client = mpd.connect({port: 6600, host: 'localhost'});
    client.on('ready', function() {
      log.info('mpd ready');
      cmd = mpd.cmd;
    });
    client.on('error', function(error) {
      log.error(`mpd error: ${error}`); 
    });
  },

  cmd: (command, params, cb) => {
    if (!cmd || !client) {
      log.warn(`No mpd, but asked to do: ${cmd}`);
    } else {
      log.info(`MPD command: ${cmd}`);
      cb = cb ? cb : function() {};
      return client.sendCommand(cmd(command, params), cb);
    }
  }
};