const express = require('express'),
  bodyParser = require('body-parser'),
  log = require('./log'),
  app = express();

let clientCb;

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', function(req, res) {
  if (clientCb) {
    clientCb(req.body.a);
    res.json(0);
  } else {
    log.error('web: no cb registered!');
    res.json(1);
  }
});

module.exports = {
  start: () => {
    app.listen(6606);
  },
  subscribe: (cb) => {
    clientCb = cb;
  }
}
