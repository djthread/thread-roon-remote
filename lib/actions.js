const log = require('./log'),
  { exec } = require('child_process'),
	request = require('request');

let mode = 'roon'; // 'roon' or 'mpd'

const go = (roonFn, mpdFn) => {
  mode == 'roon' ? roonFn() : mpdFn();
};

module.exports = {
  run: (action, roon, mpd, ashuffle) => {
    if (action == 'previous') {
      go(() => { roon.control('previous'); },
        () => { mpd && mpd.cmd('previous'); });

    } else if (action == 'toggle') {
      go(() => { roon.control('playpause'); },
        () => { mpd && mpd.cmd('pause'); });

    } else if (action == 'next') {
      go(() => { roon.control('next'); },
        () => { mpd && mpd.cmd('next'); });

    } else if (action == 'shutdown') {
      log.warn('shutting down!');
      mpd && mpd.cmd('stop', []);
      exec('shutdown -h now');

    } else if (action == 'powerbot-shutdown') {
      log.warn('doing powerbot shutdown!');
      mpd && mpd.cmd('stop', []);

      var clientServerOptions = {
        uri: 'http://bookshelf.threadbox.net:4000/api/system/off',
        // body: JSON.stringify(postData),
        method: 'POST'
      };

      request(clientServerOptions, function (error, response) {
        console.log(error, response.body);
      });

    } else if (action == 'seekback') {
      go(() => { roon.seek('relative', -30); },
        () => { mpd && mpd.cmd('seekcur', ['-30']); });

    } else if (action == 'seekfwd') {
      go(() => { roon.seek('relative', 60); },
        () => { mpd && mpd.cmd('seekcur', ['+60']); });

    } else if (action == 'mode') {
      if (mode == 'roon') {
        mode = 'mpd';
        ashuffle.start();
        roon.control('stop', () => {
          roon.standby(() => {
            // mpd.cmd('play');
          });
        });
      } else {
        mode = 'roon';
        ashuffle.stop();
        mpd && mpd.cmd('stop', [], () => {
          roon.control('play');
        });
      }

    } else {
      log.warn('Unmapped action:', action);
    }
  }
}
