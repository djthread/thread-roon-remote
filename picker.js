// Lists the available zones, displays a list, and
// populates the zone_id file
//
const log = require('./lib/log'),
  roon = require('./lib/roon'),
  readline = require('readline'),
  fs = require('fs');

const selector = function selector(cmd, data) {
  let zones = [];

  if (!data.zones) return;

  data.zones.forEach((zone) => {
    zones.push([zone.display_name, zone.zone_id]);
  });

  let q = '';
  for (let i=0; i<zones.length; i++) {
    q += `${i+1}: ${zones[i]}\n`;
  }
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.question(`${q}\n> `, (a) => {
    if (zones[a-1]) {
      const zone_id = zones[a-1][1];
      log.info(`Writing zone_id: ${zone_id}`)
      fs.writeFileSync("zone_id", zone_id);      
      log.info('Done.');
    } else {
      log.error('Dunno what you mean.');
    }
    process.exit();
  });
};

roon.start(
  "Thread's Output Selector",
  null,
  () => { log.info('connected.'); },
  selector,
  {log_level: "none"}
);
