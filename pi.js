const mpd = require('./lib/mpd'),
  roon = require('./lib/roon'),
  joystick = require('./lib/joy');

// const { exec, spawn } = require('child_process');

const zone = '160115e8162dfe46cdcd8ea578ecefa359a3'; // JukePi Hugo2
let mode = 'roon'; // 'roon' or 'mpd'

const go = (roonFn, mpdFn) => {
  if (mode == 'roon') {
    roonFn();
  } else {
    mpdFn();
  }
};

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
    exec("shutdown -h now");
  }
});

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
        case 'mpd': mpdcmd('previous', []); break;
      }
      break;
    case 0: // b
      console.log('Button 1 - playpause');
      switch (mode) {
        case 'roon': trans.control(zone, 'playpause'); break;
        case 'mpd': mpdcmd('pause', []); break;
      }
      break;
    case 1: // a
      console.log('Button 2 - next');
      switch (mode) {
        case 'roon': trans.control(zone, 'next'); break;
        case 'mpd': mpdcmd('next', []); break;
      }
      break;
    case 8: // select
      console.log('sutting down...');
      client.sendCommand(cmd('stop', []));
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
          case 'mpd': mpdcmd('seekcur', ['-30']); break;
        }
      } else if (ev.value > 0) { // right
        console.log('seeking forwards');
        switch (mode) {
          case 'roon': trans.seek(zone, 'relative', 30); break;
          case 'mpd': mpdcmd('seekcur', ['+30']); break;
        }
      }
      break;
    case 1:
      if (ev.value < 0) { // up - toggle mode
        if (mode == 'roon') {
          console.log('MPD MODE!');
          mode = 'mpd';
          trans.control(zone, 'stop', () => {
            exec('systemctl restart mpd.service', () => {
              setTimeout(() => {
                mpd_connect();
                ashuffle(true);
              }, 1000);
            });
          });
          // exec('systemctl stop roonbridge.service', () => {
          //   exec('systemctl start mpd.service', () => {
          //     console.log('** mpd started');
          //     mpd_connect();
          //     ashuffle(true);
          //   });
          // });
        } else if (mode == 'mpd') {
          console.log('ROON MODE!');
          mode = 'roon';
          ashuffle(false);
          client.sendCommand(cmd('stop', []), function(err, msg) {
            exec('systemctl restart roonbridge.service', () => {
              console.log('ok, mpd got stop and roon is being restarted');
              setTimeout(() => {
                trans.control(zone, 'play', () => {
                  console.log('pressed play on roon');
                });
              }, 12000);
            });
          });

          // exec('systemctl stop mpd.service', () => {
          //   exec('systemctl start roonbridge.service', () => {
          //     console.log('** roonbridge started');
          //   });
          // });
        }
      } else if (ev.value > 0) { // down
      }
      break;
    default:
      console.log('UNMAPPED AXIS EVENT', ev);
  }
});

