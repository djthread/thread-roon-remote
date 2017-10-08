const log = require('./log'),
  { exec } = require('child_process');

let mode = 'roon'; // 'roon' or 'mpd'

const go = (roonFn, mpdFn) => {
  mode == 'roon' ? roonFn() : mpdFn();
};

module.exports = {
  run: (action, roon, mpd, ashuffle) => {
    if (action == 'previous') {
      go(() => { roon.control('previous'); },
        () => { mpd.cmd('previous'); });

    } else if (action == 'toggle') {
      go(() => { roon.control('playpause'); },
        () => { mpd.cmd('pause'); });

    } else if (action == 'next') {
      go(() => { roon.control('next'); },
        () => { mpd.cmd('next'); });

    } else if (action == 'shutdown') {
      log.warn('shutting down!');
      mpd.cmd('stop', []);
      exec('shutdown -h now');

    } else if (action == 'seekback') {
      go(() => { roon.seek('relative', -30); },
        () => { mpd.cmd('seekcur', ['-30']); });

    } else if (action == 'seekfwd') {
      go(() => { roon.seek('relative', 60); },
        () => { mpd.cmd('seekcur', ['+60']); });

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
        mpd.cmd('stop', [], () => {
          roon.control('play');
        });
      }

    } else {
      log.warn('Unmapped action:', action);
    }
  }
}
