const log = require('./lib/log'),
  mpd = require('./lib/mpd'),
  roon = require('./lib/roon'),
  joystick = require('./lib/joystick');

const { exec } = require('child_process');

const zone = '160115e8162dfe46cdcd8ea578ecefa359a3'; // JukePi Hugo2
let mode = 'roon'; // 'roon' or 'mpd'

const go = (roonFn, mpdFn) => {
  if (mode == 'roon') {
    roonFn();
  } else {
    mpdFn();
  }
};

roon.start();

joystick.subscribe((btn) => {
  if (btn == 'start') {
    go(() => { roon.control('previous'); },
       () => { mpd.cmd('previous', []); });

  } else if (btn == 'b') {
    go(() => { roon.control('playpause'); },
       () => { mpd.cmd('pause'); });

  } else if (btn == 'a') {
    go(() => { roon.control('next'); },
       () => { mpd.cmd('next'); });

  } else if (btn == 'select') {
    log.warn('shutting down!');
    mpd.cmd('stop', []);
    exec('shutdown -h now');

  } else if (btn == 'left') {
    go(() => { roon.seek('relative', -30); },
       () => { mpd.cmd('seekcur', ['-30']); });

  } else if (btn == 'right') {
    go(() => { roon.seek('relative', 30); },
       () => { mpd.cmd('seekcur', ['+30']); });

  } else if (btn == 'up') {
    if (mode == 'roon') {
      mode = 'mpd';
      roon.standby(() => {
        ashuffle.start();
        // mpd.cmd('play');
      });
    } else {
      mode = 'roon';
      ashuffle.stop();
      mpd.cmd('stop', [], () => {
        roon.control('play');
      });
    }

  } else {
    log.warn('Unmapped button:', btn);
  }
});
